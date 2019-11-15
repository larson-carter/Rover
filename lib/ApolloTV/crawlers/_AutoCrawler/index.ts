import axios from 'axios';
import Parser from 'fast-xml-parser';
import PageCrawler from "./PageCrawler";
import Mongoose from "mongoose";
import PageIndex from "./database/CachedPageData";
import RoverConfig from "../../../../src/struct/Config";

//const sites = ["https://putstream.win/"];
const sites = ["http://the123movies.in"];

const argv = process.argv;
let args : any = {};

// Get database from arguments
args.config = argv.find((arg) => arg.startsWith('--config='));
if(args.config) args.config = args.config.replace(/^--config=/, "");
export const config : RoverConfig = JSON.parse(new Buffer(args.config, 'base64').toString());

if(!config.database.url) throw new Error("Invalid or missing database URL.");

(async () => {

    try {
        console.log("Connecting to database...");
        await Mongoose.connect(config.database.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }catch(ex){
        throw new Error("Failed to connect to database: " + config.database.url);
    }

    for(let site of sites){
        console.log("Preparing: " + site);

        // Get the URL of the sitemap from robots.txt
        let robots : string = (await axios.get(`${site}/robots.txt`)).data;
        let primarySitemapURL : string = `${site}/sitemap.xml`;
        try {
            primarySitemapURL = robots.toLowerCase().split('sitemap: ')[1].split('\n')[0].trim();
        }catch(ignored){}

        // Parse the sitemap for page URLs.
        let primarySitemapRaw : string = (await axios.get(primarySitemapURL)).data;
        let primarySitemap = Parser.convertToJson(Parser.getTraversalObj(primarySitemapRaw), {});

        let scrapePromises : Promise<any>[] = [];
        
        if(!!primarySitemap.sitemapindex){
            console.log("Mapping: " + site);
            
            let sitemapObjects : any[] = primarySitemap.sitemapindex.sitemap;
            let sitemaps = sitemapObjects.map((sitemapData) => sitemapData.loc);
            
            for (const url of sitemaps) {
                let sitemap = Parser.convertToJson(
                    Parser.getTraversalObj((await axios.get(url)).data),
                    {}
                );
    
                await crawlMap(sitemap, scrapePromises);
            }
            
        }

        //await Promise.all(scrapePromises);

        // For each page, we need to get the following data.
        // -> Title
        // -> Year
        // -> IMDB ID (if present)
    }

    //let sitemap = await axios.get(sites[0]);
    //console.log(sitemap);
})();

async function crawlMap(sitemap: any, scrapePromises: Promise<any>[]) {
    let pages = sitemap.urlset.url;
    if(pages.loc) pages = [ pages ];
    
    for(let pageIndex of pages){
        await PageCrawler.sleep(3000);
        
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
}

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