import Video from './entity/video.js';
import Store from './service/dao/store.js';
import Theme from './service/theme/theme.js';

class Main {
    constructor() {
        this.#eventLoad();
        this.store = new Store();
        this.theme = new Theme(this.store);
    }

    #eventLoad() {
        window.addEventListener("load", (e) => {
            console.log("Todos os recursos front carregado!");
            this.#initialize();
        });
    }

    #initialize() {
        this.theme.init();
        this.#menuClickEvent();
    }


    // -------------------------------------------------------
    // menu

    #menuDisplayNone() {
        $(".displays").removeClass("d-block");
        $(".displays").addClass("d-none");
    }

    #menuDisplay(elem) {
        $(`#${elem}`).addClass("d-block");
        $(`#${elem}`).removeClass("d-none");
    }
    #menuClickEvent() {
        $(".display-menu").click((e) => {
            const data = $(e.currentTarget).attr("data-tcc-menu");
            this.#menuDisplayNone();
            this.#menuDisplay(data);
        });
    }
}

const app = new Main();