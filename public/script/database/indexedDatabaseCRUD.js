const musicsByNameStore = "musicsName";
const musicsByAnimeStore = "musicsAnime";
const musicsBySeasonStore = "musicsSeason";
const musicsStore = "musics";
const playlistsStore = "playlists";
const timelineStore = "timeline";
let database;

export function indexedDatabaseCRUD() {


    function init(config = {}) {
        database = (config.db) ? config.db : startDB();
    }

    function startDB() {
        const request = window.indexedDB.open("superPlayerMusic", 3);

        request.onsuccess = (event) => {
            database = request.result;
        }

        request.onupgradeneeded = (event) => {
            console.log("Upgraded")
        }
    }

    function create(json, store, events) {
        let transaction = database.transaction([store], 'readwrite');
        let objectStore = transaction.objectStore(store);
        let request = objectStore.put(json);
        request.onsuccess = (e) => {
            events.create(json, e.target.result);
        };
    }

    function read(store, events) {
        let transaction = db.transaction(store);
        let objectStore = transaction.objectStore(store);
        objectStore.openCursor().onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
                events.read(cursor.value);
                cursor.continue();
            }
        };

        transaction.oncomplete = () => {
            events.readComplete();
        };
    }

    return {
        init,
        create,
        read
    }
}