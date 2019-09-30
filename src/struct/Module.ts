import * as P from "pino";
import Application, {Utility} from "../application";

export interface ModuleAuthor {
    name: string;
    website: string;
}

export interface ModuleMetadata {
    name: string;
    version: string;
    description?: string;
}

export type ModuleType = "module" | "scraper" | "crawler";
export default abstract class Module {
    private status : string;
    private author : ModuleAuthor;
    protected metadata : ModuleMetadata;
    private readonly type : ModuleType;

    protected constructor(metadata: ModuleMetadata, type: ModuleType) {
        this.metadata = metadata;
        this.type = type;
    }

    protected getLogger() : P.Logger {
        return Application.getUtility<P.Logger>(Utility.Logger).child({
            module: this.metadata.name
        });
    }

    abstract initialize() : void;
    abstract terminate() : void;

    getMeta() : ModuleMetadata {
        return this.metadata;
    }

    getType() : ModuleType {
        return this.type || 'module';
    }

    setAuthor(author: ModuleAuthor){
        if(this.author !== null && this.author !== undefined)
            throw new Error(this.metadata.name + " has already got an author set.");
        this.author = author;
    }

    getAuthor() : ModuleAuthor {
        return this.author;
    }

    setStatus(status: string) {
        this.status = status;
    }

    getStatus() : string {
        return this.status;
    }

}