
import { theme } from "./theme.js";
import { display } from "./display.js";
import { defaultConfigs } from "./defaultConfigs.js";
import { musicManager } from "./musicManager.js";
import { playlistManager } from "./playlistManager.js";
import { search } from "./search.js";
import { localStorageObject } from "./localStorageObject.js";
import { events } from "./events.js";
import { mediaManager } from "./mediaManager.js";

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
        mediaManagerClass = mediaManager();
        displayClass = display();
        musicManagerClass = musicManager();
        playlistManagerClass = playlistManager();
        eventsClass = events();
        searchClass = search();

        defaultConfigsClass.init();
        themeClass.init({ "localStorageObject": localStorageObjectClass });
        searchClass.init();
        eventsClass.init({ "theme": themeClass,"mediaManager": mediaManagerClass, "display": displayClass, "player": this, "playlistManager": playlistManagerClass, "musicManager": musicManagerClass });
        displayClass.init({ "player": this, "events": eventsClass });
        musicManagerClass.init({ "events": eventsClass });
        playlistManagerClass.init({ "events": eventsClass });
        mediaManagerClass.init({ "musicManager": musicManagerClass, "events": eventsClass });

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
        //eventsClass.reload();
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

    return {
        init,
        newPlayList,
        reload,
        searchAction,
        clearData,
        disableAlertPwa,
        installPwa
    }

}
