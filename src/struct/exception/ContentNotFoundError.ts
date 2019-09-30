import Module from "../Module";
import {ScrapeRequest} from "../Scraper";

export class ContentNotFoundError extends Error {

    constructor(module: Module, req: ScrapeRequest, url?: string) {
        module.getLogger().error(`Failed to find results for: ${req.title} (${req.year})` + (url ? ` on ${url}` : ''));
        super(`Failed to find results for: ${req.title} (${req.year}).`);
    }

}