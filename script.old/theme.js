import { localStorageObject } from "./database/localStorageObject.js";

let localStorageClass;

export function theme() {

    function init(config = {}) {
        localStorageClass = (config.localStorageObject) ? config.localStorageObject : localStorageObject();
        start();
    }

    function start() {
        radioConfig();
        toggleDarkLight();
    }

    function radioConfig() {
        const theme = getTheme().theme;

        switch (theme) {
            case "default":
                $(".radioTheme").filter('[value=default]').prop('checked', true);
                break;
            case "dark":
                $(".radioTheme").filter('[value=dark]').prop('checked', true);
                break;
            case "light":
                $(".radioTheme").filter('[value=light]').prop('checked', true);
                break;
            default:
                $(".radioTheme").filter('[value=default]').prop('checked', true);
                break;
        }
    }

    function toggleDarkLight() {
        const theme = getTheme().theme;

        switch (theme) {
            case "default":
                setDeviceTheme();
                break;
            case "dark":
                addClass(theme);
                break;
            case "light":
                addClass(theme);
                break;
            default:
                setDeviceTheme();
                setTheme("default");
                break;
        }
    }

    function getTheme() {
        let theme = localStorageClass.getTheme();
        return theme;
    }

    function setTheme(data) {
        const theme = { "theme": data };
        localStorageClass.setTheme(theme);
    }

    function removeClass() {
        $(".themeClear").removeClass("bg-clear-dark").removeClass("bg-clear-light");
        $(".themeDeep").removeClass("bg-deep-dark").removeClass("bg-deep-light");
        $(".themeClearLink").removeClass("bg-clear-dark-link").removeClass("bg-clear-light-link");
        $(".themeClearMenu").removeClass("bg-clear-dark-menu").removeClass("bg-clear-light-menu");
    }

    function addClass(theme) {
        removeClass();
        $(".themeClear").addClass("bg-clear-" + theme);
        $(".themeDeep").addClass("bg-deep-" + theme);
        $(".themeClearLink").addClass("bg-clear-" + theme + "-link");
        $(".themeClearMenu").addClass("bg-clear-" + theme + "-menu");
        if(theme === "dark"){
            $(".btn-outline-secondary").addClass("btn-outline-light").removeClass("btn-outline-secondary");
        }else{
            $(".btn-outline-light").addClass("btn-outline-secondary").removeClass("btn-outline-light");
        }
    }

    function setDeviceTheme() {
        if (window.matchMedia('(prefers-color-scheme)').media !== 'not all') {
            if (window.matchMedia('(prefers-color-scheme: dark)').matches)
                addClass("dark");
            else
                addClass("light");
        } else {
            addClass("light");
        }
    }

    return {
        init,
        setTheme,
        toggleDarkLight
    }
}