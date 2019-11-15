import axios from 'axios';
import TMDBIntegration from "../../../../src/util/TMDBIntegration";
import {ContentMeta} from "./database/CachedPageData";

export default class PageCrawler {

    static async crawl(url: string){
        console.log("Crawling: " + url);

        try {
            let response = await axios.get(url);
            let html = response.data;
            
            let content : ContentMeta = await this.identifyContent(html);
            
            // If no content was identified on the page, we can ignore it.
            if(!content) return;
            // Otherwise, we should store the hosts for that content.
            await this.storeHosts(content);
        }catch(ex){
            console.error("An error occurred whilst crawling: " + url);
            console.error(ex);
        }
    }
    
    static async identifyContent(html: string) : Promise<ContentMeta> {
        let imdbIdMatches = html.match(/tt\d{7,8}/g);
    
        // If we were able to identify an IMDB ID on the page, we can use that to
        // fetch the content information.
        if(imdbIdMatches && imdbIdMatches.length > 0) {
            let imdbId = imdbIdMatches[0];
            return await TMDBIntegration.fetchContentInformation({
                imdbId
            });
        }
        
        return null;
    }
    
    static async storeHosts(meta: ContentMeta){
    
    }
    
    /**
     * Sleep for delay ms.
     * @param delay The delay in milliseconds to wait.
     */
    static async sleep(delay: number){
        return new Promise((resolve, reject) => {
            setTimeout(resolve, delay);
        });
    }

}