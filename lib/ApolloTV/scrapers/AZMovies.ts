import Scraper, {ScrapeRequest} from "../../../src/struct/Scraper";
import Encoding from "../../../src/util/Encoding";

export default class AZMovies extends Scraper {

    constructor(){
        super({
            // The name of your scraper module.
            // By convention, the UpperCamelCase form of the name of the website the scraper is for.
            name: "AZMovies",

            // The version of your scraper module.
            // Not currently hugely important to be honest.
            // Feel free to just make it '1.0.0'.
            version: "1.0.0",

            // The list of URLs your module is able to scrape.
            // This is helpful if several websites with different domains have
            // (for these intents and purposes) the same source code.
            urls: ["https://azmovie.to"]
        });
    }

    async scrapeHostLinks(url: string, req: ScrapeRequest): Promise<string[]> {
        // Make a request to the search page for AZMovie.
        let $: CheerioStatic = await this.http.$post(`${url}/livesearch.php`, Encoding.formURL({
            "searchVal": req.title
        }));

        let moviePage;
        $('a').toArray().some((searchResultElement : CheerioElement) => {
            for(let childNode of searchResultElement.childNodes){
                if(childNode.data === `${req.title} (${req.year})` || childNode.data === req.title){
                    let path: string = $(searchResultElement).attr('href');
                    moviePage = `${url}/${path}`;
                    return true;
                }
            }

            return false;
        });
        if(!moviePage) return [];

        return [];
    }

}