export interface EntityUniqueId {
    id: string,
    type: 'song' | 'album',
    title?: string,
    artistName?: string,
    thumbnailUrl?: string,
    thumbnailWidth?: number,
    thumbnailHeight?: number,
    apiProvider: APIProvider,
    platforms: Platform[],
}

type Platform =
    | 'spotify'
    | 'itunes'
    | 'appleMusic'
    | 'youtube'
    | 'youtubeMusic'
    | 'google'
    | 'googleStore'
    | 'pandora'
    | 'deezer'
    | 'tidal'
    | 'amazonStore'
    | 'amazonMusic'
    | 'soundcloud'
    | 'napster'
    | 'yandex'
    | 'spinrilla';

type APIProvider =
    | 'spotify'
    | 'itunes'
    | 'youtube'
    | 'google'
    | 'pandora'
    | 'deezer'
    | 'tidal'
    | 'amazon'
    | 'soundcloud'
    | 'napster'
    | 'yandex'
    | 'spinrilla';
