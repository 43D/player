import { localStorageObject } from "./localStorageObject.js";

let localStorageClass;

export function defaultConfigs() {
    function init(config = {}) {
        localStorageClass = (config.localStorageObject) ? config.localStorageObject : localStorageObject();
        start();
    }

    function start() {
        const data = getDataConfig();

        data.forEach(function (value) {
            if (isNull(value[0]()))
                value[1]();
        });
    }

    function getDataConfig() {
        const data = [];
        data.push([localStorageClass.getConfig, createConfig]);
        data.push([localStorageClass.getLanguage, createLanguage]);
        data.push([localStorageClass.getMusics, createMusic]);
        data.push([localStorageClass.getPwa, createPwa]);
        data.push([localStorageClass.getTheme, createTheme]);

        return data;
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

    function createPwa() {
        const pwa = { "alert": true }

        localStorageClass.setPwa(pwa);
    }

    function createTheme() {
        const theme = { "theme": "default" };

        localStorageClass.setTheme(theme);
    }

    return {
        init
    }
}