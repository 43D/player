export const DBConfig = {
    name: "SuperPlayer",
    version: 6,
    objectStoresMeta: [
        {
            store: "songs",
            storeConfig: { keyPath: "id", autoIncrement: true },
            storeSchema: [
                { name: "annSongId", keypath: "annSongId", options: { unique: true } },
                { name: "annId", keypath: "annId", options: { unique: false } },
                { name: "animeENName", keypath: "animeENName", options: { unique: false } },
                { name: "animeJPName", keypath: "animeJPName", options: { unique: false } },
                { name: "animeVintage", keypath: "animeVintage", options: { unique: false } },
                { name: "animeType", keypath: "animeType", options: { unique: false } },
                { name: "arrangers", keypath: "arrangers", options: { unique: false, multiEntry: true } },
                { name: "artists", keypath: "artists", options: { unique: false,  multiEntry: true } },
                { name: "audio", keypath: "audio", options: { unique: false } },
                { name: "composers", keypath: "composers", options: { unique: false,  multiEntry: true } },
                { name: "HQ", keypath: "HQ", options: { unique: false } },
                { name: "MQ", keypath: "MQ", options: { unique: false } },
                { name: "songType", keypath: "songType", options: { unique: false } },
                { name: "songName", keypath: "songName", options: { unique: false } },
                { name: "songArtist", keypath: "songArtist", options: { unique: false } },
            ],
        },
        {
            store: "pages",
            storeConfig: { keyPath: "id", autoIncrement: false },
            storeSchema: [
                { name: "count", keypath: "count", options: { unique: false } }
            ],
        },
        {
            store: "songsDate",
            storeConfig: { keyPath: "annSongId", autoIncrement: false },
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
            storeConfig: { keyPath: "annSongId", autoIncrement: false },
            storeSchema: [
                { name: "count", keypath: "count", options: { unique: false } },
            ],
        },
        {
            store: "artists",
            storeConfig: { keyPath: "id", autoIncrement: false },
            storeSchema: [
                { name: "name", keypath: "name", options: { unique: false } },
                { name: "musics", keypath: "musics", options: { unique: false } },
            ],
        },
        {
            store: "composers",
            storeConfig: { keyPath: "id", autoIncrement: false },
            storeSchema: [
                { name: "name", keypath: "name", options: { unique: false } },
                { name: "musics", keypath: "musics", options: { unique: false } },
            ],
        },
        {
            store: "arrangers",
            storeConfig: { keyPath: "id", autoIncrement: false },
            storeSchema: [
                { name: "name", keypath: "name", options: { unique: false } },
                { name: "musics", keypath: "musics", options: { unique: false } },
            ],
        },
    ],
};