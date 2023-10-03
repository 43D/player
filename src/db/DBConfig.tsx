export const DBConfig = {
    name: "SuperSongs",
    version: 4,
    objectStoresMeta: [
        {
            store: "songs",
            storeConfig: { keyPath: "annSongId", autoIncrement: true },
            storeSchema: [
                { name: "annId", keypath: "annId", options: { unique: false } },
                { name: "animeENName", keypath: "animeENName", options: { unique: false } },
                { name: "animeJPName", keypath: "animeJPName", options: { unique: false } },
                { name: "animeVintage", keypath: "animeVintage", options: { unique: false } },
                { name: "animeType", keypath: "animeType", options: { unique: false } },
                { name: "songType", keypath: "songType", options: { unique: false } },
                { name: "songName", keypath: "songName", options: { unique: false } },
                { name: "songArtist", keypath: "songArtist", options: { unique: false } },
                { name: "HQ", keypath: "HQ", options: { unique: false } },
                { name: "MQ", keypath: "MQ", options: { unique: false } },
                { name: "audio", keypath: "audio", options: { unique: false } },
                { name: "composers", keypath: "composers", options: { unique: false } },
            ],
        },
        {
            store: "songsDate",
            storeConfig: { keyPath: "annSongId", autoIncrement: true },
            storeSchema: [
                { name: "HQ", keypath: "HQ", options: { unique: false } },
                { name: "MQ", keypath: "MQ", options: { unique: false } },
                { name: "audio", keypath: "audio", options: { unique: false } },
            ],
        },
        {
            store: "playlists",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "title", keypath: "title", options: { unique: false } },
                { name: "songsCollections", keypath: "songsCollections", options: { unique: false } },
            ],
        },
        {
            store: "queue",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "songsCollections", keypath: "songsCollections", options: { unique: false } },
            ],
        },
        {
            store: "count",
            storeConfig: { keyPath: "annSongId", autoIncrement: true },
            storeSchema: [
                { name: "count", keypath: "count", options: { unique: false } },
            ],
        },
    ],
};