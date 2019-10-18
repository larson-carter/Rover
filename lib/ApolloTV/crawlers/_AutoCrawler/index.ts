import axios from 'axios';
import Parser from 'fast-xml-parser';
import PageCrawler from "./PageCrawler";
import Mongoose from "mongoose";
import {PageIndex} from "./database/CachedPageData";
import index from "../../../../api/v2";

const sites = ["https://azm.to"];

const argv = process.argv;
let args : any = {};

// Get database from arguments
args.dbURL = argv.find((arg) => arg.startsWith('--db='));
if(args.dbURL) args.dbURL = args.dbURL.replace(/^--db=/, "");
if(!args.dbURL) throw new Error("Invalid or missing database URL.");

(async () => {

    try {
        console.log("Connecting to database...");
        await Mongoose.connect(args.dbURL, {
            useNewUrlParser: true
        });
    }catch(ex){
        throw new Error("Failed to connect to database: " + args.dbURL);
    }

    for(let site of sites){
        console.log("Crawling: " + site);

        // Get the URL of the sitemap from robots.txt
        let robots : string = (await axios.get(`${site}/robots.txt`)).data;
        let primarySitemapURL : string = robots.toLowerCase().split('sitemap: ')[1].split('\n')[0].trim();

        // Parse the sitemap for page URLs.
        let primarySitemapRaw : string = (await axios.get(primarySitemapURL)).data;
        let primarySitemap = Parser.convertToJson(Parser.getTraversalObj(primarySitemapRaw));

        let scrapePromises = [];

        let pages = primarySitemap.urlset.url;
        for(let pageIndex of pages){
            let pageURL : string = pageIndex.loc;

            // We don't want to bother re-indexing pages in the cache already.
            let indexedPages = await PageIndex.find({
                url: pageURL
            });
            if(indexedPages.length > 0) continue;

            let pageExpiry : Date;
            try {
                pageExpiry = getExpiryDate(pageIndex.changefreq);
            }catch(ex){
                pageExpiry = getExpiryDate('daily');
            }

            scrapePromises.push(PageCrawler.crawl(pageURL).then(async () => {
                /*
                    await PageIndex.create({
                        url: pageURL,
                        expiry: pageExpiry
                    });
                */
            }));
        }

        await Promise.all(scrapePromises);

        // For each page, we need to get the following data.
        // -> Title
        // -> Year
        // -> IMDB ID (if present)
    }

    //let sitemap = await axios.get(sites[0]);
    //console.log(sitemap);
})();

type ChangeFreqString = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
function getExpiryDate(changeFreqString: ChangeFreqString) : Date {
    let now = new Date();

    return {
        'always': () => getExpiryDate('daily'),
        'hourly': () => getExpiryDate('daily'),
        'daily': () => {
            now.setUTCDate(now.getUTCDate() + 1);
            return now;
        },
        'weekly': () => {
            now.setUTCDate(now.getUTCDate() + 7);
            return now;
        },
        'monthly': () => getExpiryDate('weekly'),
        'yearly': () => getExpiryDate('weekly'),
        'never': () => getExpiryDate('weekly'),
    }[changeFreqString]();
}