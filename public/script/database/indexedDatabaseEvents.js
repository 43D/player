import { indexedDatabaseCRUD } from "./indexedDatabaseCRUD.js";
import { indexedDatabase } from "./indexedDatabase.js";

let indexedDatabaseCRUDClass;
let indexedDatabaseClass;

export function indexedDatabaseEvents() {
    function init(config = {}) {
        indexedDatabaseCRUDClass = (config.indexedDatabaseCRUD) ? config.indexedDatabaseCRUD : indexedDatabaseCRUD();
        indexedDatabaseClass = (config.indexedDatabase) ? config.indexedDatabase : indexedDatabase();
    }

    function getPlayListStore() {
        return playListStore;
    }

    function getMusicStore() {
        return musicStore;
    }

    return {
        init,
        getPlayListStore,
        getMusicStore
    }
}


function musicStore() {
    function create(id, json, last) {
        console.log("music");
        if (indexedDatabaseClass.getNewPlaylist()) {
            indexedDatabaseClass.addPlaylist(id);
            if (last) {
                indexedDatabaseCRUDClass.read(indexedDatabaseClass.getPlaylist(), "playlists", playListStore, "id", json.playlists[json.playlists.length - 1]);
            }
        }
    }

    function readComplete(data, json, store, last) {
        if (!data) {
            indexedDatabaseCRUDClass.create(json, store, musicStore);
        } else {
            console.log("music");
            if (indexedDatabaseClass.getNewPlaylist()) {
                data.playlists[data.playlists.length] = json.playlists[json.playlists.length - 1];
                indexedDatabaseCRUDClass.create(data, store, mok);
                indexedDatabaseClass.addPlaylist(data.id);
                if (last) {
                    indexedDatabaseCRUDClass.read(indexedDatabaseClass.getPlaylist(), "playlists", playListStore, "id", json.playlists[json.playlists.length - 1]);
                }
            }
        }
    }
    function readAllComplete() { }

    return {
        create,
        readComplete,
        readAllComplete
    }
}
function playListStore() {
    function create(id, json, extra) {
        extra.forEach(element => {
            element.playlists[element.playlists.length] = id;
        });
        indexedDatabaseClass.saveAll(extra);
    }
    function readComplete(data, dados, store, extra) {
        let arr = [...dados, ...[...new Set(data.musics)]];
        data.musics = [...new Set(arr)];
        console.log(data);
        indexedDatabaseCRUDClass.create(data, "playlists", mok);
    }
    function readAllComplete() { }

    return {
        create,
        readComplete,
        readAllComplete
    }
}


function mok() {
    function create(id, json, extra) { }
    function readComplete(data, json, store, extra) { }
    function readAllComplete() { }

    return {
        create,
        readComplete,
        readAllComplete
    }
}