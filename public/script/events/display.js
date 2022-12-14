import { events } from "./events.js";

let eventsClass;

export function display() {
    function init(config = {}) {
        eventsClass = (config.events) ? config.events : events();
        eventsClass.start();
    }

    function displayHiddenAll() {
        $(".tela").addClass("d-none");
    }

    function displayShowById(id) {
        displayHiddenAll();
        $("#" + id).removeClass("d-none");
    }

    function displayHiddenDisplayMain() {
        $(".displays").addClass("d-none");
    }

    function displayMainShowById(id = "") {
        const tema = $("#" + id);
        const currentClass = tema[0].classList[2];
        displayHiddenDisplayMain();
        (currentClass == "d-none") ? showById(id) : showById("display-main");
    }

    function showById(id) {
        $("#" + id).removeClass("d-none");
    }

    function hiddenById(id) {
        $("#" + id).addClass("d-none");
    }

    return {
        init,
        displayShowById,
        displayMainShowById,
        showById,
        hiddenById
    }
}