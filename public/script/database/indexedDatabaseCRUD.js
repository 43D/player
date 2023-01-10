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
        const request = window.indexedDB.open("superPlayerMusic", 4);

        request.onsuccess = (event) => {
            database = request.result;
        }

        request.onupgradeneeded = (event) => {
            console.log("Upgraded")
        }
    }

    function create(json, store, events, extra = {}) {
        let transaction = database.transaction([store], 'readwrite');
        let objectStore = transaction.objectStore(store);
        let request = objectStore.put(json);
        request.onsuccess = (e) => {
            const id = e.target.result;
            events().create(id, json, extra);
        };
    }

    function readAll(store, events) {
        let transaction = database.transaction(store);
        let objectStore = transaction.objectStore(store);
        objectStore.openCursor().onsuccess = (event) => {
            let cursor = event.target.result;
            if (cursor) {
                events.read(cursor.value);
                cursor.continue();
            }
        };

        transaction.oncomplete = () => {
            events().readAllComplete();
        };
    }

    function read(json, store, events, indexKey = "id", key = "0", extra = false) {
        let transaction = database.transaction(store);
        let objectStore = transaction.objectStore(store);

        let index = objectStore.index(indexKey);
        let request = index.get(key);

        request.onsuccess = function (e) {
            const data = request.result;

            events().readComplete(data, json, store, extra);
        };
    }

    return {
        init,
        create,
        read,
        readAll
    }
}