import Mongoose, { Document } from "mongoose";
import {ContentType} from "../../../../../src/struct/ContentType";

export interface ContentMeta {
    /**
     * The TMDB ID of the content.
     */
    id: string;
    
    /**
     * The type of content that was returned.
     */
    type: ContentType;
    
    /**
     * The human-readable title of the content. Duplicates are allowed.
     */
    title: string;
    
    /**
     * The release year of the content.
     */
    year: number;
    
    /**
     * References to the content on external services.
     */
    externalIds?: {
        imdb?: string;
    }
}

export interface IPageIndex extends Document {
    content: ContentMeta;
    url: string;
    expiry: Date;
}

const PageIndexSchema = new Mongoose.Schema({
    
    content: {
        id: String,
        type: Number,
        title: String,
        externalIds: Object
    },
    url: String,
    expiry: {
        type: Date,
        expires: 0,
        default: '1d'
    }
    
});

export default Mongoose.model<IPageIndex>('indexedPage', PageIndexSchema);