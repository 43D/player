import { localStorageObject } from "./localStorageObject.js";

let localStorageClass;

export function theme(config = {}) {
    localStorageClass = (config.localStorageObject) ? config.localStorageObject : localStorageObject();
    $("#dark_light").click(function () { toggleDarkLight() });
    $(".tema").removeClass("dark-mode").removeClass("light-mode").addClass(getTheme().theme);
    $("body").removeClass("dark-mode").removeClass("light-mode").addClass(getTheme().theme);


    function getTheme() {
        let theme = localStorageClass.getTheme();
        if (theme == undefined || theme == null) {
            theme = { "theme": "light-mode" };
            localStorageClass.setTheme(theme);
        }
        return theme;
    }

    function setTheme(data) {
        localStorageClass.setTheme(data);
    }

    function toggleDarkLight() {
        var tema = $("body");
        var currentClass = tema[0].classList[1];
        var newClass = (currentClass == "dark-mode") ? "light-mode" : "dark-mode";
        tema.removeClass(currentClass).addClass(newClass);
        setTheme({ "theme": newClass });
    }

    return {
    }
}