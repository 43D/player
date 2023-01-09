
import { theme } from "../theme.js";
import { display } from "../events/display.js";
import { defaultConfigs } from "../defaultConfigs.js";
import { musicManager } from "./musicManager.js";
import { playlistManager } from "./playlistManager.js";
import { search } from "./search.js";
import { localStorageObject } from "../database/localStorageObject.js";
import { events } from "../events/events.js";
import { mediaManager } from "./mediaManager.js";
import { database } from "../database/database.old.js";
import { importMusic } from "./importMusic.js";


let importMusicClass;
let databaseClass;
let mediaManagerClass;
let eventsClass;
let localStorageObjectClass;
let searchClass;
let musicManagerClass;
let playlistManagerClass;
let defaultConfigsClass;
let themeClass;
let displayClass;

let deferredPrompt;
export function player() {
    function init() {
        localStorageObjectClass = localStorageObject();
        defaultConfigsClass = defaultConfigs();
        themeClass = theme();
        databaseClass = database();
        mediaManagerClass = mediaManager();
        importMusicClass = importMusic();

        musicManagerClass = musicManager();
        playlistManagerClass = playlistManager();
        //searchClass = search();
        displayClass = display();
        eventsClass = events();

        defaultConfigsClass.init();
        themeClass.init({ "localStorageObject": localStorageObjectClass });
        eventsClass.init({ "importMusic": importMusicClass, "theme": themeClass, "mediaManager": mediaManagerClass, "display": displayClass, "player": this, "playlistManager": playlistManagerClass, "musicManager": musicManagerClass });
        displayClass.init({ "player": this, "events": eventsClass });
        databaseClass.init({ "player": this, "musicManager": musicManagerClass });
        mediaManagerClass.init({ "musicManager": musicManagerClass, "events": eventsClass });
        importMusicClass.init({ "database": databaseClass });

        musicManagerClass.init({ "events": eventsClass, "database": databaseClass });
        playlistManagerClass.init({ "events": eventsClass, "database": databaseClass  });
        //searchClass.init();
        themeClass.toggleDarkLight();
        getParam();
        checkPwa();
    }

    function newPlayList(name) {
        playlistManagerClass.newPlayList(name)
    }

    function getParam() {
        const url = window.location.hash.split("fast=")[1];
        eventsClass.actionUrl(url);
    }

    function reload() {
        musicManagerClass.reload();
        playlistManagerClass.reload();
    }

    function searchAction() {
        searchClass.start();
    }

    function clearData() {
        localStorageObjectClass.clear();
    }

    function checkPwa() {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();

            deferredPrompt = e;

            pwaAlert();
        });
    }

    function pwaAlert() {
        const pwa = localStorageObjectClass.getPwa();

        if (pwa.alert)
            $("#pwa-alert").modal("show");
    }

    function disableAlertPwa() {
        let pwa = localStorageObjectClass.getPwa();
        pwa.alert = false;
        localStorageObjectClass.setPwa(pwa);
    }

    function installPwa() {
        let pwa = localStorageObjectClass.getPwa();

        deferredPrompt.prompt();

        deferredPrompt.userChoice
            .then((res) => {
                console.log(res);
                if (res.outcome === "accepted") {
                    pwa.alert = false;
                    localStorageObjectClass.setPwa(pwa);
                    $("#pwa-alert").modal("hide");
                }
            });
    }

    function displayDb(){
        displayClass.displayShowById("display-error-db");
    }

    return {
        init,
        newPlayList,
        reload,
        searchAction,
        clearData,
        disableAlertPwa,
        installPwa,
        displayDb
    }

}
