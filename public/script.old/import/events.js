import { display } from "./display.js";
import { importJson } from "./importJson.js";

let displayClass;
let importJsonClass;

export function eventos() {

    function init(config = {}) {
        displayClass = (config.display) ? config.display : display();
        importJsonClass = (config.importJson) ? config.importJson : importJson();
    }

    function start() {
        btnImport();
        btnConfirm();
        btnSalvar();
        isNewPlaylist();
    }

    function btnImport() {
        $("#btnImport").click(function () {
            displayClass.exibirImport();
        });
    }

    function btnConfirm() {
        $("#btnConfirmForm").click(async function () {
            const json = importJsonClass.getJson();
            const res = await json.getAMQ();
            if (res != undefined) {
                const data = await json.getData();
                importJsonClass.setList(data);
                importJsonClass.makeTable();
                importJsonClass.confirmar();
                makeDatePlaylist();
            }
        });
    }

    function makeDatePlaylist() {
        const current = new Date();

        const time = current.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour12: false
        });

        $("#newPlaylistName").val(time.replaceAll("/", "-").replaceAll(" ", "-").replaceAll(":", "-"));
    }

    function btnSalvar() {
        $("#btnSalvar").click(function () {
            let array = [];
            const list = $(".checkbox");
            for (let i = 0; i < list.length; i++) {
                array[i] = list[i].checked;
            }

            importJsonClass.setChoose(array);
            importJsonClass.saveList();
            displayClass.exibirFinal();
        });
    }

    function isNewPlaylist() {
        $("#newPlaylist").click(function (e) {
            if ($("#newPlaylist").prop('checked')) {
                $("#newPlaylistName").prop("disabled", false);
            } else {
                $("#newPlaylistName").prop("disabled", true);
            }
        });

    }

    return {
        init,
        start
    }

}