import axios from 'axios';
import {ContentMeta} from "../../lib/ApolloTV/crawlers/_AutoCrawler/database/CachedPageData";
import Application from "../application";
import {ContentType} from "../struct/ContentType";
import {config} from "../../lib/ApolloTV/crawlers/_AutoCrawler";

/**
 * A reference to content meta information stored on an external
 * service.
 */
interface RemoteContentMetaReference {
    
    /**
     * The IMDB ID associated with the content.
     */
    imdbId: string;
    
}

export default class TMDBIntegration {
    
    static async fetchContentInformation(by: RemoteContentMetaReference) : Promise<ContentMeta> {
        const { imdbId } = by;
        
        if(!!imdbId){
            // TODO: Fetch information from TMDB using IMDB ID
            let tmdbData = (await axios.get(`https://api.themoviedb.org/3/find/${imdbId}?api_key=${config.integrations.tmdbKey}&external_source=imdb_id`)).data;
            
            if(tmdbData.movie_results.length > 0){
                // A movie was returned, as there is no ID duplication on IMDB, I'm going to assume
                // that this movie and only this movie was returned.
                let movie = tmdbData.movie_results[0];
                return {
                    id: movie.id,
                    title: movie.title,
                    year: new Date(movie.release_date).getUTCFullYear(),
                    type: ContentType.MOVIE
                }
            }
            
            if(tmdbData.tv_results.length > 0){
                // The same applies for TV shows - as with movies.
                let tvShow = tmdbData.tv_results[0];
                return {
                    id: tvShow.id,
                    title: tvShow.title,
                    year: new Date(tvShow.release_date).getUTCFullYear(),
                    type: ContentType.TV_SHOW
                }
            }
        }
        
        return null;
    }
    
}