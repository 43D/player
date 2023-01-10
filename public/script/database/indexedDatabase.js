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
const dbVersion = 4;
let db;

let indexedDatabaseCRUDClass;
let playerClass;
let indexedDatabaseEventsClass;


let newPlaylist = false;
let playlistNumber = [];
export function indexedDatabase() {

    function init(config = {}) {
        playerClass = (config.player) ? config.player : player();
        indexedDatabaseCRUDClass = (config.indexedDatabaseCRUD) ? config.indexedDatabaseCRUD : indexedDatabaseCRUD();
        indexedDatabaseEventsClass = (config.indexedDatabaseEvents) ? config.indexedDatabaseEvents : indexedDatabaseEvents();



        if (window.indexedDB) {
            startDB();
            indexedDatabaseCRUDClass.init({ "db": db });
            indexedDatabaseEventsClass.init({ "indexedDatabaseCRUD": indexedDatabaseCRUDClass, "indexedDatabase": this });
        } else {
            playerClass.displayDb();
        }


    }

    function startDB() {
        const request = window.indexedDB.open(dbName, dbVersion);

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
        objectPlayListStore.createIndex('id', 'id', { unique: true });

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

    function saveMusic(data, playlist, boolean) {
        newPlaylist = boolean;
        playlistNumber = [];
        if (newPlaylist) {
            indexedDatabaseCRUDClass.create(playlist, playlistsStore, indexedDatabaseEventsClass.getPlayListStore(), data);
        } else {
            saveAll(data)
        }
    }

    function saveAll(data) {
        for (let i = 0; i < data.length; i++) {
            if (data.length - 1 == i) {
                indexedDatabaseCRUDClass.read(data[i], musicsStore, indexedDatabaseEventsClass.getMusicStore(), "hash", [data[i].urlId, data[i].malid], true);
            } else {
                indexedDatabaseCRUDClass.read(data[i], musicsStore, indexedDatabaseEventsClass.getMusicStore(), "hash", [data[i].urlId, data[i].malid], false);
            }
        };
        data.forEach(element => {
        });
    }

    function getNewPlaylist() {
        return newPlaylist;
    }

    function addPlaylist(num) {
        playlistNumber[playlistNumber.length] = num;
    }

    function getPlaylist() {
        return playlistNumber;
    }
    return {
        init,
        saveMusic,
        saveAll,
        getNewPlaylist,
        addPlaylist,
        getPlaylist
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