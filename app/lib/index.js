"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/parsers/spotify.js
var require_spotify = __commonJS({
  "src/parsers/spotify.js"(exports2, module2) {
    "use strict";
    var RE = /open\.spotify\.com(?:\/[a-z]{2,8}(?:-[a-zA-Z]+)*)?\/track\/([A-Za-z0-9]+)/;
    function parse(url) {
      const m = url.match(RE);
      if (!m) return null;
      return { platform: "spotify", trackId: m[1] };
    }
    module2.exports = { parse };
  }
});

// src/parsers/appleMusic.js
var require_appleMusic = __commonJS({
  "src/parsers/appleMusic.js"(exports2, module2) {
    "use strict";
    var RE_QUERY = /music\.apple\.com\/[^/]+\/album\/[^?]+\?.*\bi=(\d+)/;
    var RE_SONG = /music\.apple\.com\/[^/]+\/song\/[^/]+\/(\d+)/;
    function parse(url) {
      let m = url.match(RE_QUERY);
      if (m) return { platform: "appleMusic", trackId: m[1] };
      m = url.match(RE_SONG);
      if (m) return { platform: "appleMusic", trackId: m[1] };
      return null;
    }
    module2.exports = { parse };
  }
});

// src/parsers/youtubeMusic.js
var require_youtubeMusic = __commonJS({
  "src/parsers/youtubeMusic.js"(exports2, module2) {
    "use strict";
    var RE = /music\.youtube\.com\/watch\?(?:[^&]*&)*v=([A-Za-z0-9_-]{11})/;
    function parse(url) {
      const m = url.match(RE);
      if (!m) return null;
      return { platform: "youtubeMusic", trackId: m[1] };
    }
    module2.exports = { parse };
  }
});

// src/parsers/deezer.js
var require_deezer = __commonJS({
  "src/parsers/deezer.js"(exports2, module2) {
    "use strict";
    var RE = /deezer\.com(?:\/[a-z]{2}(?:-[a-zA-Z]+)*)?\/track\/(\d+)/;
    function parse(url) {
      const m = url.match(RE);
      if (!m) return null;
      return { platform: "deezer", trackId: m[1] };
    }
    module2.exports = { parse };
  }
});

// src/parsers/tidal.js
var require_tidal = __commonJS({
  "src/parsers/tidal.js"(exports2, module2) {
    "use strict";
    var RE = /(?:tidal\.com\/browse|listen\.tidal\.com)\/track\/(\d+)|tidal\.com\/album\/\d+\/track\/(\d+)|tidal\.com\/track\/(\d+)/;
    function parse(url) {
      const m = url.match(RE);
      if (!m) return null;
      return { platform: "tidal", trackId: m[1] || m[2] || m[3] };
    }
    module2.exports = { parse };
  }
});

// src/parsers/youtube.js
var require_youtube = __commonJS({
  "src/parsers/youtube.js"(exports2, module2) {
    "use strict";
    var RE_WATCH = /(?:www\.)?youtube\.com\/watch\?(?:[^&]*&)*v=([A-Za-z0-9_-]{11})/;
    var RE_SHORT = /youtu\.be\/([A-Za-z0-9_-]{11})/;
    function parse(url) {
      const m = url.match(RE_WATCH) || url.match(RE_SHORT);
      if (!m) return null;
      return { platform: "youtube", trackId: m[1] };
    }
    module2.exports = { parse };
  }
});

// src/parsers/yandexMusic.js
var require_yandexMusic = __commonJS({
  "src/parsers/yandexMusic.js"(exports2, module2) {
    "use strict";
    var RE = /music\.yandex\.(?:ru|com)\/album\/(\d+)\/track\/(\d+)/;
    function parse(url) {
      const m = url.match(RE);
      if (!m) return null;
      return { platform: "yandexMusic", trackId: `${m[1]}:${m[2]}` };
    }
    module2.exports = { parse };
  }
});

// src/parsers/soundcloud.js
var require_soundcloud = __commonJS({
  "src/parsers/soundcloud.js"(exports2, module2) {
    "use strict";
    var RE_TRACK = /^https?:\/\/soundcloud\.com\/([^/]+)\/(?!sets\/)([^/?#]+)/;
    var RE_SHORT = /^https?:\/\/on\.soundcloud\.com\/[A-Za-z0-9]+/;
    function parse(url) {
      if (RE_TRACK.test(url) || RE_SHORT.test(url)) {
        return { platform: "soundcloud", trackId: url.split("?")[0] };
      }
      return null;
    }
    module2.exports = { parse };
  }
});

// src/parsers/index.js
var require_parsers = __commonJS({
  "src/parsers/index.js"(exports2, module2) {
    "use strict";
    var spotify = require_spotify();
    var appleMusic = require_appleMusic();
    var youtubeMusic = require_youtubeMusic();
    var deezer = require_deezer();
    var tidal = require_tidal();
    var youtube = require_youtube();
    var yandexMusic = require_yandexMusic();
    var soundcloud = require_soundcloud();
    var parsers = [spotify, appleMusic, youtubeMusic, deezer, tidal, youtube, yandexMusic, soundcloud];
    function parseUrl2(rawUrl) {
      for (const parser of parsers) {
        const result = parser.parse(rawUrl);
        if (result) return result;
      }
      return null;
    }
    module2.exports = { parseUrl: parseUrl2 };
  }
});

// src/matcher.js
var require_matcher = __commonJS({
  "src/matcher.js"(exports2, module2) {
    "use strict";
    var FEAT_RE = /\s*[\(\[](feat\.?|ft\.?|featuring)[^\)\]]*[\)\]]/gi;
    var REMASTER_RE = /\s*[\(\[](remastered?|re-?master[^\)\]]*|deluxe[^\)\]]*|anniversary[^\)\]]*|live[^\)\]]*|mono[^\)\]]*|stereo[^\)\]]*)[^\)\]]*[\)\]]/gi;
    var PUNC_RE = /[^\w\s]/g;
    function normalize(str) {
      if (!str) return "";
      return str.toLowerCase().replace(FEAT_RE, "").replace(REMASTER_RE, "").replace(PUNC_RE, " ").replace(/\s+/g, " ").trim();
    }
    function tokenize(str) {
      return new Set(normalize(str).split(" ").filter(Boolean));
    }
    function jaccardSimilarity(a, b) {
      const setA = tokenize(a);
      const setB = tokenize(b);
      if (!setA.size && !setB.size) return 1;
      if (!setA.size || !setB.size) return 0;
      let intersection = 0;
      for (const token of setA) {
        if (setB.has(token)) intersection++;
      }
      const union = setA.size + setB.size - intersection;
      return intersection / union;
    }
    var WEIGHTS = { title: 0.5, artist: 0.35, duration: 0.15 };
    var ACCEPT_THRESHOLD = 0.45;
    function findBestMatch2(source, candidates) {
      for (const c of candidates) {
        if (c.score === 1) return c;
      }
      if (source.isrc) {
        for (const c of candidates) {
          if (c.isrc && c.isrc === source.isrc) {
            return { ...c, score: 1 };
          }
        }
      }
      let best = null;
      let bestScore = -Infinity;
      for (const c of candidates) {
        const titleSim = jaccardSimilarity(source.title, c.title);
        const artistSim = jaccardSimilarity(source.artist, c.artist);
        let durationSim = 0;
        if (source.durationMs && c.durationMs) {
          const diff = Math.abs(source.durationMs - c.durationMs);
          durationSim = Math.max(0, 1 - diff / 1e4);
        }
        const score = WEIGHTS.title * titleSim + WEIGHTS.artist * artistSim + WEIGHTS.duration * durationSim;
        if (score > bestScore) {
          bestScore = score;
          best = { ...c, score: parseFloat(score.toFixed(4)) };
        }
      }
      if (best && bestScore >= ACCEPT_THRESHOLD) return best;
      return null;
    }
    module2.exports = { findBestMatch: findBestMatch2 };
  }
});

// src/config.js
var require_config = __commonJS({
  "src/config.js"(exports2, module2) {
    "use strict";
    require("dotenv").config();
    var required = ["SPOTIFY_CLIENT_ID", "SPOTIFY_CLIENT_SECRET", "YOUTUBE_API_KEY", "TIDAL_CLIENT_ID", "TIDAL_CLIENT_SECRET", "SOUNDCLOUD_CLIENT_ID"];
    var missing = required.filter((k) => !process.env[k]);
    if (missing.length) {
      console.warn(`Warning: missing env vars: ${missing.join(", ")} \u2014 related adapters will be unavailable`);
    }
    module2.exports = {
      port: parseInt(process.env.PORT || "3000", 10),
      spotify: {
        clientId: process.env.SPOTIFY_CLIENT_ID || "",
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET || ""
      },
      youtube: {
        apiKey: process.env.YOUTUBE_API_KEY || ""
      },
      tidal: {
        clientId: process.env.TIDAL_CLIENT_ID || "",
        clientSecret: process.env.TIDAL_CLIENT_SECRET || "",
        countryCode: process.env.TIDAL_COUNTRY || "US"
      },
      soundcloud: {
        clientId: process.env.SOUNDCLOUD_CLIENT_ID || ""
      }
    };
  }
});

// src/adapters/spotify.js
var require_spotify2 = __commonJS({
  "src/adapters/spotify.js"(exports2, module2) {
    "use strict";
    var axios = require("axios");
    var { spotify: cfg } = require_config();
    var tokenCache = { token: null, expiresAt: 0 };
    async function getToken() {
      if (tokenCache.token && Date.now() < tokenCache.expiresAt) {
        return tokenCache.token;
      }
      const creds = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64");
      const res = await axios.post(
        "https://accounts.spotify.com/api/token",
        "grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${creds}`,
            "Content-Type": "application/x-www-form-urlencoded"
          }
        }
      );
      tokenCache = {
        token: res.data.access_token,
        // refresh 60s before actual expiry
        expiresAt: Date.now() + (res.data.expires_in - 60) * 1e3
      };
      return tokenCache.token;
    }
    async function authHeader() {
      const token = await getToken();
      return { Authorization: `Bearer ${token}` };
    }
    function mapTrack(t) {
      const images = t.album?.images || [];
      const coverUrl = images[0]?.url || null;
      return {
        title: t.name,
        artist: t.artists.map((a) => a.name).join(", "),
        album: t.album?.name || "",
        isrc: t.external_ids?.isrc || null,
        durationMs: t.duration_ms,
        coverUrl,
        url: t.external_urls?.spotify || `https://open.spotify.com/track/${t.id}`
      };
    }
    async function getTrackMetadata(trackId) {
      const headers = await authHeader();
      const res = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`, { headers });
      return mapTrack(res.data);
    }
    async function searchTrack({ title, artist, isrc }) {
      const headers = await authHeader();
      if (isrc) {
        const res2 = await axios.get("https://api.spotify.com/v1/search", {
          headers,
          params: { q: `isrc:${isrc}`, type: "track", limit: 1 }
        });
        const items = res2.data.tracks?.items || [];
        if (items.length) {
          return [{ ...mapTrack(items[0]), score: 1 }];
        }
      }
      const q = `track:${title} artist:${artist}`;
      const res = await axios.get("https://api.spotify.com/v1/search", {
        headers,
        params: { q, type: "track", limit: 10 }
      });
      return (res.data.tracks?.items || []).map(mapTrack);
    }
    module2.exports = { getTrackMetadata, searchTrack };
  }
});

// src/adapters/appleMusic.js
var require_appleMusic2 = __commonJS({
  "src/adapters/appleMusic.js"(exports2, module2) {
    "use strict";
    var axios = require("axios");
    var BASE = "https://itunes.apple.com";
    function mapResult(item) {
      if (item.wrapperType !== "track" && item.kind !== "song") return null;
      const coverUrl = item.artworkUrl100 ? item.artworkUrl100.replace("100x100bb", "600x600bb") : null;
      return {
        title: item.trackName || "",
        artist: item.artistName || "",
        album: item.collectionName || "",
        isrc: null,
        // iTunes API does not expose ISRC
        durationMs: item.trackTimeMillis || null,
        coverUrl,
        url: item.trackViewUrl || null
      };
    }
    async function getTrackMetadata(trackId) {
      const res = await axios.get(`${BASE}/lookup`, {
        params: { id: trackId, entity: "song" }
      });
      const results = (res.data.results || []).filter((r) => r.wrapperType === "track" || r.kind === "song");
      if (!results.length) throw new Error(`Apple Music: no track found for id ${trackId}`);
      return mapResult(results[0]);
    }
    async function searchTrack({ title, artist, isrc }) {
      if (isrc) {
        const res2 = await axios.get(`${BASE}/lookup`, {
          params: { isrc, entity: "song" }
        });
        const items = (res2.data.results || []).filter((r) => r.wrapperType === "track" || r.kind === "song");
        if (items.length) {
          return [{ ...mapResult(items[0]), score: 1 }];
        }
      }
      const term = `${title} ${artist}`.trim();
      const res = await axios.get(`${BASE}/search`, {
        params: { term, media: "music", entity: "song", limit: 10 }
      });
      return (res.data.results || []).map(mapResult).filter(Boolean);
    }
    module2.exports = { getTrackMetadata, searchTrack };
  }
});

// src/adapters/youtubeUtils.js
var require_youtubeUtils = __commonJS({
  "src/adapters/youtubeUtils.js"(exports2, module2) {
    "use strict";
    function parseDuration(iso) {
      const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
      if (!m) return null;
      const h = parseInt(m[1] || "0", 10);
      const min = parseInt(m[2] || "0", 10);
      const s = parseInt(m[3] || "0", 10);
      return (h * 3600 + min * 60 + s) * 1e3;
    }
    var BRACKET_SUFFIX_RE = /\s*[\[(][^\])\n]*(?:official|music\s*video|lyric|audio|remaster|visuali[sz]|live\s*ver|acoustic|hd|4k|explicit|radio\s*edit|single\s*ver|extended)[^\])\n]*[\])]/gi;
    var BARE_SUFFIX_RE = /\s+(?:official|remastered?|hd|4k|live|explicit|audio)\s*$/gi;
    function parseYouTubeTitle(rawTitle, channelTitle) {
      const channel = channelTitle.replace(/\s*-\s*Topic$/i, "").trim();
      let cleaned = rawTitle.replace(BRACKET_SUFFIX_RE, "").replace(BARE_SUFFIX_RE, "").trim();
      const sepIdx = cleaned.indexOf(" - ");
      if (sepIdx !== -1) {
        const left = cleaned.slice(0, sepIdx).trim();
        const right = cleaned.slice(sepIdx + 3).trim();
        const chanLower = channel.toLowerCase();
        if (left.toLowerCase() === chanLower || chanLower.includes(left.toLowerCase())) {
          return { title: right, artist: left };
        }
        if (right.toLowerCase() === chanLower || chanLower.includes(right.toLowerCase())) {
          return { title: left, artist: right };
        }
        return { title: right, artist: left };
      }
      return { title: cleaned, artist: channel };
    }
    function bestThumbnail(thumbnails) {
      const t = thumbnails || {};
      return (t.maxres || t.standard || t.high || t.medium || t.default)?.url || null;
    }
    module2.exports = { parseDuration, parseYouTubeTitle, bestThumbnail };
  }
});

// src/adapters/youtubeMusic.js
var require_youtubeMusic2 = __commonJS({
  "src/adapters/youtubeMusic.js"(exports2, module2) {
    "use strict";
    var axios = require("axios");
    var { youtube: cfg } = require_config();
    var { parseDuration, parseYouTubeTitle, bestThumbnail } = require_youtubeUtils();
    var BASE = "https://www.googleapis.com/youtube/v3";
    function mapVideo(item) {
      const snippet = item.snippet || {};
      const details = item.contentDetails || {};
      return {
        title: snippet.title || "",
        artist: snippet.channelTitle || "",
        album: "",
        isrc: null,
        durationMs: details.duration ? parseDuration(details.duration) : null,
        coverUrl: bestThumbnail(snippet.thumbnails),
        url: `https://music.youtube.com/watch?v=${item.id}`
      };
    }
    async function getTrackMetadata(videoId) {
      const res = await axios.get(`${BASE}/videos`, {
        params: { part: "snippet,contentDetails", id: videoId, key: cfg.apiKey }
      });
      const items = res.data.items || [];
      if (!items.length) throw new Error(`YouTube Music: no video found for id ${videoId}`);
      const item = items[0];
      const snippet = item.snippet || {};
      const details = item.contentDetails || {};
      const { title, artist } = parseYouTubeTitle(snippet.title || "", snippet.channelTitle || "");
      return {
        title,
        artist,
        album: "",
        isrc: null,
        durationMs: details.duration ? parseDuration(details.duration) : null,
        coverUrl: bestThumbnail(snippet.thumbnails),
        url: `https://music.youtube.com/watch?v=${videoId}`
      };
    }
    async function searchTrack({ title, artist }) {
      const q = `${title} ${artist}`.trim();
      const searchRes = await axios.get(`${BASE}/search`, {
        params: { part: "snippet", type: "video", videoCategoryId: "10", q, maxResults: 10, key: cfg.apiKey }
      });
      const videoIds = (searchRes.data.items || []).map((i) => i.id?.videoId).filter(Boolean);
      if (!videoIds.length) return [];
      const detailRes = await axios.get(`${BASE}/videos`, {
        params: { part: "snippet,contentDetails", id: videoIds.join(","), key: cfg.apiKey }
      });
      return (detailRes.data.items || []).map(mapVideo);
    }
    module2.exports = { getTrackMetadata, searchTrack };
  }
});

// src/adapters/deezer.js
var require_deezer2 = __commonJS({
  "src/adapters/deezer.js"(exports2, module2) {
    "use strict";
    var axios = require("axios");
    var BASE = "https://api.deezer.com";
    function mapTrack(t) {
      const coverUrl = t.album?.cover_xl || t.album?.cover_big || t.album?.cover_medium || null;
      return {
        title: t.title || "",
        artist: t.artist?.name || "",
        album: t.album?.title || "",
        isrc: t.isrc || null,
        durationMs: t.duration ? t.duration * 1e3 : null,
        coverUrl,
        url: t.link || `https://www.deezer.com/track/${t.id}`
      };
    }
    async function getTrackMetadata(trackId) {
      const res = await axios.get(`${BASE}/track/${trackId}`);
      if (res.data.error) throw new Error(`Deezer: ${res.data.error.message}`);
      return mapTrack(res.data);
    }
    async function searchTrack({ title, artist, isrc }) {
      if (isrc) {
        try {
          const res2 = await axios.get(`${BASE}/track/isrc:${isrc}`);
          if (!res2.data.error && res2.data.id) {
            return [{ ...mapTrack(res2.data), score: 1 }];
          }
        } catch (_) {
        }
      }
      const q = `track:"${title}" artist:"${artist}"`;
      const res = await axios.get(`${BASE}/search`, { params: { q, limit: 10 } });
      return (res.data.data || []).map(mapTrack);
    }
    module2.exports = { getTrackMetadata, searchTrack };
  }
});

// src/adapters/tidal.js
var require_tidal2 = __commonJS({
  "src/adapters/tidal.js"(exports2, module2) {
    "use strict";
    var axios = require("axios");
    var { tidal: cfg } = require_config();
    var AUTH_URL = "https://auth.tidal.com/v1/oauth2/token";
    var BASE = "https://openapi.tidal.com/v2";
    var ACCEPT = "application/vnd.api+json";
    var tokenCache = { token: null, expiresAt: 0 };
    async function getToken() {
      if (tokenCache.token && Date.now() < tokenCache.expiresAt) return tokenCache.token;
      const creds = Buffer.from(`${cfg.clientId}:${cfg.clientSecret}`).toString("base64");
      const res = await axios.post(AUTH_URL, "grant_type=client_credentials", {
        headers: {
          Authorization: `Basic ${creds}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
      tokenCache = {
        token: res.data.access_token,
        expiresAt: Date.now() + (res.data.expires_in - 60) * 1e3
      };
      return tokenCache.token;
    }
    function country() {
      return cfg.countryCode || "US";
    }
    async function makeClient() {
      const token = await getToken();
      return axios.create({
        baseURL: BASE,
        headers: { Authorization: `Bearer ${token}`, Accept: ACCEPT }
      });
    }
    function buildLookup(included = []) {
      const map = {};
      for (const item of included) {
        map[`${item.type}:${item.id}`] = item;
      }
      return map;
    }
    function parseIsoDuration(iso) {
      if (!iso || typeof iso !== "string") return null;
      const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
      if (!m) return null;
      const h = parseFloat(m[1] || "0");
      const min = parseFloat(m[2] || "0");
      const s = parseFloat(m[3] || "0");
      return Math.round((h * 3600 + min * 60 + s) * 1e3);
    }
    function coverUrlFromCoverArt(coverArtAttrs) {
      const links = coverArtAttrs?.imageLinks;
      if (!Array.isArray(links) || !links.length) return null;
      const largest = links.slice().sort((a, b) => (b.meta?.width || 0) - (a.meta?.width || 0))[0];
      return largest?.href || null;
    }
    function mapTrackItem(trackItem, lookup) {
      const attrs = trackItem.attributes || {};
      const rels = trackItem.relationships || {};
      const artistNames = (rels.artists?.data || []).map((ref) => lookup[`artists:${ref.id}`]?.attributes?.name).filter(Boolean);
      const albumRef = (rels.albums?.data || [])[0];
      const album = albumRef ? lookup[`albums:${albumRef.id}`] : null;
      const albumAttrs = album?.attributes || {};
      const albumRels = album?.relationships || {};
      const coverArtRef = albumRels.coverArt?.data;
      const coverArtId = Array.isArray(coverArtRef) ? coverArtRef[0]?.id : coverArtRef?.id;
      const coverArtAttrs = coverArtId ? (lookup[`coverArts:${coverArtId}`] || lookup[`coverArt:${coverArtId}`])?.attributes : null;
      return {
        title: attrs.title || "",
        artist: artistNames.join(", "),
        album: albumAttrs.title || "",
        isrc: attrs.isrc || null,
        durationMs: parseIsoDuration(attrs.duration),
        coverUrl: coverUrlFromCoverArt(coverArtAttrs),
        url: `https://tidal.com/browse/track/${trackItem.id}`
      };
    }
    var TRACK_INCLUDE = "artists,albums,albums.coverArt";
    var SEARCH_INCLUDE = "tracks.artists,tracks.albums,tracks.albums.coverArt";
    async function getTrackMetadata(trackId) {
      const c = await makeClient();
      const res = await c.get(`/tracks/${trackId}`, {
        params: { countryCode: country(), include: TRACK_INCLUDE }
      });
      if (process.env.TIDAL_DEBUG) {
        console.log("[tidal] data.attributes:", JSON.stringify(res.data.data?.attributes, null, 2));
        console.log("[tidal] included:", JSON.stringify(res.data.included, null, 2));
      }
      const lookup = buildLookup(res.data.included);
      return mapTrackItem(res.data.data, lookup);
    }
    async function searchTrack({ title, artist, isrc }) {
      const c = await makeClient();
      if (isrc) {
        const res2 = await c.get("/tracks", {
          params: { "filter[isrc]": isrc, countryCode: country(), include: TRACK_INCLUDE }
        });
        const items = res2.data.data || [];
        if (items.length) {
          const lookup2 = buildLookup(res2.data.included);
          return [{ ...mapTrackItem(items[0], lookup2), score: 1 }];
        }
      }
      const q = encodeURIComponent(`${title} ${artist}`.trim());
      const res = await c.get(`/searchresults/${q}/relationships/tracks`, {
        params: { countryCode: country(), include: SEARCH_INCLUDE, limit: 10 }
      });
      const refs = res.data.data || [];
      const lookup = buildLookup(res.data.included);
      return refs.map((ref) => {
        const trackItem = lookup[`tracks:${ref.id}`];
        return trackItem ? mapTrackItem(trackItem, lookup) : null;
      }).filter(Boolean);
    }
    module2.exports = { getTrackMetadata, searchTrack };
  }
});

// src/adapters/youtube.js
var require_youtube2 = __commonJS({
  "src/adapters/youtube.js"(exports2, module2) {
    "use strict";
    var axios = require("axios");
    var { youtube: cfg } = require_config();
    var { parseDuration, parseYouTubeTitle, bestThumbnail } = require_youtubeUtils();
    var BASE = "https://www.googleapis.com/youtube/v3";
    function mapVideo(item) {
      const snippet = item.snippet || {};
      const details = item.contentDetails || {};
      return {
        title: snippet.title || "",
        artist: snippet.channelTitle || "",
        album: "",
        isrc: null,
        durationMs: details.duration ? parseDuration(details.duration) : null,
        coverUrl: bestThumbnail(snippet.thumbnails),
        url: `https://www.youtube.com/watch?v=${item.id}`
      };
    }
    async function getTrackMetadata(videoId) {
      const res = await axios.get(`${BASE}/videos`, {
        params: { part: "snippet,contentDetails", id: videoId, key: cfg.apiKey }
      });
      const items = res.data.items || [];
      if (!items.length) throw new Error(`YouTube: no video found for id ${videoId}`);
      const item = items[0];
      const snippet = item.snippet || {};
      const details = item.contentDetails || {};
      const { title, artist } = parseYouTubeTitle(snippet.title || "", snippet.channelTitle || "");
      return {
        title,
        artist,
        album: "",
        isrc: null,
        durationMs: details.duration ? parseDuration(details.duration) : null,
        coverUrl: bestThumbnail(snippet.thumbnails),
        url: `https://www.youtube.com/watch?v=${videoId}`
      };
    }
    async function searchTrack({ title, artist }) {
      const q = `${title} ${artist}`.trim();
      const searchRes = await axios.get(`${BASE}/search`, {
        params: { part: "snippet", type: "video", videoCategoryId: "10", q, maxResults: 10, key: cfg.apiKey }
      });
      const videoIds = (searchRes.data.items || []).map((i) => i.id?.videoId).filter(Boolean);
      if (!videoIds.length) return [];
      const detailRes = await axios.get(`${BASE}/videos`, {
        params: { part: "snippet,contentDetails", id: videoIds.join(","), key: cfg.apiKey }
      });
      return (detailRes.data.items || []).map(mapVideo);
    }
    module2.exports = { getTrackMetadata, searchTrack };
  }
});

// src/adapters/yandexMusic.js
var require_yandexMusic2 = __commonJS({
  "src/adapters/yandexMusic.js"(exports2, module2) {
    "use strict";
    var axios = require("axios");
    var WEB_BASE = "https://music.yandex.ru";
    var WEB_HEADERS = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      "Accept": "application/json, text/javascript, */*; q=0.01",
      "Accept-Language": "ru,en;q=0.9",
      "X-Requested-With": "XMLHttpRequest",
      "Referer": "https://music.yandex.ru/"
    };
    function coverUrl(uri) {
      if (!uri) return null;
      return `https://${uri.replace("%%", "1000x1000")}`;
    }
    function mapWebTrack(t) {
      const album = (t.albums || [])[0] || t.album || {};
      return {
        title: t.title || "",
        artist: (t.artists || []).map((a) => a.name).join(", "),
        album: album.title || "",
        isrc: null,
        durationMs: t.durationMs || null,
        coverUrl: coverUrl(t.coverUri || album.coverUri || null),
        url: album.id ? `https://music.yandex.ru/album/${album.id}/track/${t.id}` : `https://music.yandex.ru/track/${t.id}`
      };
    }
    async function getTrackMetadata(combinedId) {
      const [albumId, trackId] = combinedId.includes(":") ? combinedId.split(":") : [null, combinedId];
      if (!albumId) throw new Error("Yandex Music: albumId required for web handler");
      const res = await axios.get(`${WEB_BASE}/handlers/track.jsx`, {
        headers: WEB_HEADERS,
        params: { track: trackId, album: albumId }
      });
      const t = res.data.track;
      if (!t) throw new Error("Yandex Music web: no track in response");
      return mapWebTrack(t);
    }
    async function searchTrack({ title, artist }) {
      const text = `${title} ${artist}`.trim();
      const res = await axios.get(`${WEB_BASE}/handlers/music-search.jsx`, {
        headers: WEB_HEADERS,
        params: { text, type: "tracks", ncrnd: Math.random() }
      });
      const tracks = res.data.tracks?.items || res.data.tracks?.results || [];
      return tracks.slice(0, 10).map(mapWebTrack);
    }
    module2.exports = { getTrackMetadata, searchTrack };
  }
});

// src/adapters/soundcloud.js
var require_soundcloud2 = __commonJS({
  "src/adapters/soundcloud.js"(exports2, module2) {
    "use strict";
    var axios = require("axios");
    var { soundcloud: cfg } = require_config();
    var API_BASE = "https://api-v2.soundcloud.com";
    function params(extra = {}) {
      return { client_id: cfg.clientId, ...extra };
    }
    function coverUrl(artworkUrl) {
      if (!artworkUrl) return null;
      return artworkUrl.replace("-large.", "-t500x500.");
    }
    function mapTrack(t) {
      return {
        title: t.title || "",
        artist: t.user?.username || "",
        album: "",
        isrc: null,
        durationMs: t.duration || null,
        coverUrl: coverUrl(t.artwork_url || t.user?.avatar_url || null),
        url: t.permalink_url || `https://soundcloud.com/${t.user?.permalink}/${t.permalink}`
      };
    }
    function warnIfCredentialError(err) {
      const status = err.response?.status;
      if (status === 401) {
        console.error("[SoundCloud] client_id is invalid or expired \u2014 update SOUNDCLOUD_CLIENT_ID in .env");
      } else if (status === 403) {
        console.error("[SoundCloud] client_id is blocked by SoundCloud \u2014 extract a new one from browser DevTools");
      } else if (status === 429) {
        console.warn("[SoundCloud] rate limit hit \u2014 client_id may be throttled or banned");
      }
    }
    async function getTrackMetadata(trackUrl) {
      try {
        const res = await axios.get(`${API_BASE}/resolve`, {
          params: params({ url: trackUrl })
        });
        const t = res.data;
        if (t.kind !== "track") throw new Error("SoundCloud: resolved resource is not a track");
        return mapTrack(t);
      } catch (err) {
        warnIfCredentialError(err);
        throw err;
      }
    }
    async function searchTrack({ title, artist }) {
      const q = `${title} ${artist}`.trim();
      try {
        const res = await axios.get(`${API_BASE}/search/tracks`, {
          params: params({ q, limit: 10 })
        });
        return (res.data.collection || []).map(mapTrack);
      } catch (err) {
        warnIfCredentialError(err);
        throw err;
      }
    }
    module2.exports = { getTrackMetadata, searchTrack };
  }
});

// src/resolver.js
var { parseUrl } = require_parsers();
var { findBestMatch } = require_matcher();
var adapters = {
  spotify: require_spotify2(),
  appleMusic: require_appleMusic2(),
  youtubeMusic: require_youtubeMusic2(),
  deezer: require_deezer2(),
  tidal: require_tidal2(),
  youtube: require_youtube2(),
  yandexMusic: require_yandexMusic2(),
  soundcloud: require_soundcloud2()
};
var ALL_PLATFORMS = Object.keys(adapters);
async function resolve(rawUrl) {
  const parsed = parseUrl(rawUrl);
  if (!parsed) {
    const err = new Error("Unrecognized or unsupported URL");
    err.status = 422;
    throw err;
  }
  const { platform, trackId } = parsed;
  const sourceAdapter = adapters[platform];
  let sourceMeta;
  try {
    sourceMeta = await sourceAdapter.getTrackMetadata(trackId);
  } catch (e) {
    const err = new Error(`Failed to fetch metadata from ${platform}: ${e.message}`);
    err.status = 502;
    throw err;
  }
  const targetPlatforms = ALL_PLATFORMS.filter((p) => p !== platform);
  const query = { title: sourceMeta.title, artist: sourceMeta.artist, isrc: sourceMeta.isrc };
  const settledResults = await Promise.allSettled(
    targetPlatforms.map((p) => adapters[p].searchTrack(query))
  );
  const results = { [platform]: { ...sourceMeta, score: 1 } };
  for (let i = 0; i < targetPlatforms.length; i++) {
    const p = targetPlatforms[i];
    const settled = settledResults[i];
    if (settled.status === "rejected") {
      results[p] = { error: settled.reason?.message || "search failed" };
    } else {
      const best = findBestMatch(sourceMeta, settled.value);
      results[p] = best || null;
    }
  }
  return {
    source: { platform, ...sourceMeta },
    results
  };
}
module.exports = { resolve };
//# sourceMappingURL=index.js.map