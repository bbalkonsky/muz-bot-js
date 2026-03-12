type TrackMeta = {
    title: string;
    artist: string;
    album: string;
    isrc: string | null;
    durationMs: number | null;
    coverUrl: string | null;
    url: string;
    score?: number;
};
type ResolveResult = {
    source: {
        platform: string;
    } & TrackMeta;
    results: Record<string, (TrackMeta & {
        score: number;
    }) | {
        error: string;
    } | null>;
};
/**
 * Resolve a streaming service track URL to equivalent links on all other supported platforms.
 * @param {string} rawUrl - A track URL from any supported platform
 * @returns {Promise<ResolveResult>}
 */
declare function resolve(rawUrl: string): Promise<ResolveResult>;

// @ts-ignore
export { ResolveResult, TrackMeta, resolve };
