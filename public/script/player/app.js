import { player } from "./player.js";

let deferredPrompt;

$(function () {

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();

        deferredPrompt = e;

//        btnAdd.style.display = "block";
    });

    const playerClass = player();
    playerClass.init();
});
