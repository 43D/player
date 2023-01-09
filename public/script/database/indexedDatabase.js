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
        const request = window.indexedDB.open(dbName, 2);

        request.onsuccess = (event) => {
            db = request.result;
            indexedDatabaseEventsClass.init();
            indexedDatabaseCRUDClass.init({"db" : request.result});
    
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
        objectMusicsStore.createIndex('hash', ['name', 'malid'], { unique: true });


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

    function saveMusic(data){
        
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