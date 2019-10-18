import axios from 'axios';
import Cheerio from 'cheerio';

export default class PageCrawler {

    static async crawl(url: string){
        console.log("Crawling: " + url);

        try {
            let response = await axios.get(url);
            let html = response.data;

            let $ = Cheerio.load(html);
        }catch(ex){
            console.error("An error occurred whilst crawling: " + url);
        }
    }

}