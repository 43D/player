import { player } from "../player/player.js";
import { indexedDatabaseCRUD } from "./indexedDatabaseCRUD.js";
import { indexedDatabaseEvents } from "./indexedDatabaseEvents.js"

const musicsByNameStore = "musicsName";
const musicsByAnimeStore = "musicsAnime";
const musicsBySeasonStore = "musicsSeason";
const musicsStore = "musics";
const playlistsStore = "playlists";
const timelineStore = "timeline";

const dbName = "superPlayerMusic";
let db;

let indexedDatabaseCRUDClass;
let playerClass;
let indexedDatabaseEventsClass;

export function indexedDatabase() {

    function init(config = {}) {
        playerClass = (config.player) ? config.player : player();
        indexedDatabaseCRUDClass = (config.indexedDatabaseCRUD) ? config.indexedDatabaseCRUD : indexedDatabaseCRUD();
        indexedDatabaseEventsClass = (config.indexedDatabaseEvents) ? config.indexedDatabaseEvents : indexedDatabaseEvents();

        if (window.indexedDB) {
            startDB();
        } else {
            playerClass.displayDb();
        }
    }

    function startDB() {
        const request = window.indexedDB.open(dbName, 3);

        request.onsuccess = (event) => {
            db = request.result;
            indexedDatabaseEventsClass.init();
            indexedDatabaseCRUDClass.init({ "db": request.result });

            // musicDisplay();
            // playlistDisplay();
        }

        request.onupgradeneeded = (event) => {
            createTables(event.target.result);
            console.log("Upgraded")
        }
    }

    function createTables(db) {
        let objectMusicsStore = db.createObjectStore(musicsStore,
            {
                keyPath: 'id',
                autoIncrement: true
            });

        // name {romaji, english}, artist, broadcast, duration, firstLetter, malid, playlists[], links{mal, anilist, outro}, name, season, type,  url{0,480,720}, year
        objectMusicsStore.createIndex('season', 'season', { unique: false });
        objectMusicsStore.createIndex('malid', 'malid', { unique: false });
        objectMusicsStore.createIndex('firstLetter', 'firstLetter', { unique: false });
        objectMusicsStore.createIndex('artist', 'artist', { unique: false });
        objectMusicsStore.createIndex('name', 'name', { unique: false });
        objectMusicsStore.createIndex('urlId', 'urlId', { unique: false });
        objectMusicsStore.createIndex('hash', ['urlId', 'malid'], { unique: true });


        let objectPlayListStore = db.createObjectStore(playlistsStore,
            {
                keyPath: 'id',
                autoIncrement: true
            });
        // name, musics []
        objectPlayListStore.createIndex('name', 'name', { unique: false });

        // music[]
        db.createObjectStore(timelineStore,
            {
                keyPath: 'id',
                autoIncrement: true
            });

        let musicByA = db.createObjectStore(musicsByAnimeStore,
            {
                keyPath: 'id',
                autoIncrement: true
            });
        musicByA.createIndex('name', 'name', { unique: true });

        let musicByN = db.createObjectStore(musicsByNameStore,
            {
                keyPath: 'id',
                autoIncrement: true
            });

        musicByN.createIndex('name', 'name', { unique: true });
        let musicByS = db.createObjectStore(musicsBySeasonStore,
            {
                keyPath: 'id',
                autoIncrement: true
            });

        musicByS.createIndex('name', 'name', { unique: true });
    }

    function saveMusic(obj) {
        const music = {
            "anime": {
                "romaji": obj.anime.romaji,
                "english": obj.anime.english
            },
            "artist": obj.artist,
            "broadcast": obj.animeType,
            "duration": obj.duration,
            "firstLetter": obj.name[0].toUpperCase(),
            "malid": obj.siteIds.malId,
            "links": {
                "malid": obj.siteIds.malId,
                "anilist": obj.siteIds.aniListId,
                "kitsuid": obj.siteIds.kitsuId
            },
            "name": obj.name,
            "playlists": {},
            "season": obj.vintage,
            "type": obj.type,
            "url": {
                "0": obj.urls.catbox["0"],
                "480": obj.urls.catbox["480"],
                "720": obj.urls.catbox["720"]
            },
            "urlId": obj.urlId,
            "year": obj.vintage.split(" ")[1]
        }
        console.log(music);

        // ifMusicExits, update playlist
    }

    return {
        init,
        saveMusic
    }
}

/**
 * getBySearch
 * getById
 * getByPlaylist
 * removeById
 * backupById
 * backupByPlaylist
 * RefreshInterface
 * SaveObjects
 */