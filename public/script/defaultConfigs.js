import { localStorageObject } from "./localStorageObject.js";

let localStorageClass;

export function defaultConfigs() {
    function init(config = {}) {
        localStorageClass = (config.localStorageObject) ? config.localStorageObject : localStorageObject();
        start();
    }

    function start() {
        if (isNull(localStorageClass.getConfig()))
            createConfig();
        if (isNull(localStorageClass.getLanguage()))
            createLanguage();
        if (isNull(localStorageClass.getMusics()))
            createMusic();


    }

    function createConfig() {
        const config = {
            "volume": 1.0,
            "playlast": "-1",
            "playnow": "-1",
            "playnext": "-1",
            "playtime": "0",
            "streaming": "0",
            "loop": false,
            "mute": false
        }
        localStorageClass.setConfig(config);

    }

    function createLanguage() {
        const lg = {
            "language": [
                "pt",
                "en"
            ],
            "currentLanguage": "pt"
        };
        localStorageClass.setLanguage(lg);

    }

    function createMusic() {
        const empty = {};
        const emptyArray = [];
        localStorageClass.setMusics(empty);
        localStorageClass.setPlayLists(empty);
        localStorageClass.setCurrentPlayList(emptyArray);
        localStorageClass.setMusicsAnime(empty);
        localStorageClass.setMusicsName(empty);
        localStorageClass.setMusicsSeason(empty);
    }

    function isNull(obj) {
        return (obj == null) ? true : false;
    }

    return {
        init
    }
}