import {EntityUniqueId} from "./entity-unique-id";
import {LinksByPlatform} from "./links-by-platform";

export interface Song {
    entityUniqueId: string,
    userCountry: string,
    pageUrl: string,
    linksByPlatform: {[key: string]: LinksByPlatform},
    entitiesByUniqueId: {[key: string]: EntityUniqueId},
}
