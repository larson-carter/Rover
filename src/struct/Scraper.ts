import axios, {Method} from 'axios';
import Cheerio from 'cheerio';
import Module, {ModuleMetadata} from "./Module";
import RandomUserAgent from 'random-useragent';

interface ScraperMetadata extends ModuleMetadata {
    name: string;
    version: string;
    description?: string;
    urls: Array<string>;
}

interface HTTPRequestOptions {
    /**
     * When enabled, a random user agent will NOT be generated for the
     * request being made.
     */
    disableAutomaticUserAgent?: boolean;

    /**
     * When enabled, redirects will NOT be followed if a request returns
     * a redirecting response.
     */
    noFollowRedirects?: boolean;
}

export default abstract class Scraper extends Module {
    protected metadata : ScraperMetadata;

    protected constructor(metadata: ScraperMetadata){
        super(metadata, 'scraper');
        if(metadata.description == null) metadata.description = "A scraper for " + metadata.urls;
    }

    getMeta() : ScraperMetadata {
        return this.metadata;
    }

    initialize() : void {}
    terminate() : void {}

    /**
     * This function is called to obtain a list of URLs on the servers of hosts that
     * contain the content specified in the scrapeRequest.
     *
     * @param url The URL that the content should be scraped from.
     * @param req The content request that allows the scraper to identify which content should be scraped.
     */
    async abstract scrapeHostLinks(url: string, req: ScrapeRequest) : Promise<string[]>;

    /**
     * A utility object designed to assist with making HTTP requests.
     * This object 'abstracts away' tedious/repetitive tasks like setting a random
     * user agent.
     */
    http = {
        /**
         * Makes a GET request to a server.
         *
         * @param url
         * @param headers
         * @param options
         */
        async get (url: string, headers?: Map<string, string>, options?: HTTPRequestOptions) : Promise<string> {
            return (await this.$axios('GET', url, null, headers, options)).data;
        },

        /**
         * This does exactly what the http.get() function does, however it
         * returns a Cheerio instance with the response payload loaded into it.
         *
         * @param url
         * @param headers
         * @param options
         */
        async $get (url: string, headers?: Map<string, string>, options?: HTTPRequestOptions) : Promise<CheerioStatic> {
            return Cheerio.load(await this.get(url, headers, options));
        },

        /**
         * Makes a POST request to a server.
         *
         * @param url
         * @param data
         * @param headers
         * @param options
         */
        async post (url: string, data: string, headers?: Map<string, string>, options?: HTTPRequestOptions) : Promise<string> {
            return (await this.$axios('POST', url, data, headers, options)).data;
        },

        /**
         * This does exactly what the http.post() function does, however it
         * returns a Cheerio instance with the response payload loaded into it.
         *
         * @param url
         * @param data
         * @param headers
         * @param options
         */
        async $post (url: string, data: string, headers?: Map<string, string>, options?: HTTPRequestOptions) : Promise<CheerioStatic> {
            return Cheerio.load(await this.post(url, data, headers, options));
        },


        async $axios (method: Method, url: string, data: any, headers: Map<string, string> = new Map(), options: HTTPRequestOptions = {}) {
            /*
             * This is considered the 'base' configuration. This should be valid for
             * any type of request. (i.e. method)
             */
            let config = {
                method,
                url,
                headers
            };

            /*
             * If options.disableAutomaticUserAgent is not truthy and a User-Agent
             * header has not already been specified, one will be randomly selected
             * automatically.
             */
            let { disableAutomaticUserAgent } = options;
            if(!disableAutomaticUserAgent){
                let automaticUserAgent: string = RandomUserAgent.getRandom();
                if(!headers.has('User-Agent')) headers.set('User-Agent', automaticUserAgent);
            }

            /*
             * If the noFollowRedirects option is set, axios's redirect-following
             * functionality will be turned off.
             */
            let { noFollowRedirects } = options;
            if(noFollowRedirects) {
                config = Object.assign(config, {
                    // Per the documentation:
                    // "`maxRedirects` defines the maximum number of redirects to follow in node.js."
                    // "If set to 0, no redirects will be followed."
                    maxRedirects: 0
                });
            }

            /*
             * If a request body exists, it is added to the request config.
             */
            if(data !== null) config = Object.assign(config, { data });

            return axios(config);
        }
    }

}

export interface ScrapeRequest {
    /**
     * The original title of the content that is being scraped.
     * This is usually obtained from TMDB after the content has been searched for.
     */
    title: string;

    /**
     * This is a list of alternative titles that the content may be known by.
     *
     * If the order of relevance of the titles is known, it should be sorted accordingly
     * from most relevant to least relevant by the client.
     *
     * This is not a requirement but it will make searching alternative names as well
     * as general probability of success higher.
     */
    alternativeTitles: string[];

    /**
     * This is the year the content was released.
     * We have found this to be crucial in preventing false positives for content matches.
     */
    year: string;

    /**
     * This is an array containing the names of other services that can be used
     * by the client.
     */
    services: {
        /**
         * Real-Debrid is an unrestricted download/streaming host.
         *
         * Real-Debrid subscribers use Real-Debrid to obtain links cached by Real-Debrid
         * that can be streamed without an imposed bandwidth restriction (hence allowing
         * higher quality at equivalent loading times compared to free, restricted-bandwidth
         * hosts.)
         *
         * https://real-debrid.com/
         */
        RealDebrid: boolean
    };

    /**
     * These IDs refer to the content on content catalogue/database services such as
     * IMDB.
     */
    contentIds: {
        /**
         * Several providers support finding content by IMDB ID and this is obviously
         * more ideal than using the name to find the content in a large number of
         * cases, as there is a far lower chance of false positive matches.
         */
        imdb: string;
    };
}

interface MovieScrapeRequest extends ScrapeRequest {}
interface TVScrapeRequest extends ScrapeRequest {
    season: number;
    episode: number;
}