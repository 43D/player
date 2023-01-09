import { database } from "../database/database.old.js";
import { jsonManipulator } from "../Manipulator/jsonManipulator.js";
import { fileReader } from "../Manipulator/fileReader.js";

let fileReaderClass;
let jsonManClass;
let databaseClass;
export function importMusic() {
    let data;
    let musicChoose;

    function init(config = {}) {
        databaseClass = (config.database) ? config.database : database();
        jsonManClass = (config.jsonManipulator) ? config.jsonManipulator : jsonManipulator();
        fileReaderClass = (config.fileReader) ? config.fileReader : fileReader();
    }

    //get list of json or link e make tr
    //check audio error
    async function getNewMusic() {
        if (await getData())
            if (checkData()) {
                makeTable();
                btnPlay();
                setTime();
                return true;
            }
        return false;
    }

    async function getData() {
        const tab = $(".import-tab.active").prop("id");
        if (tab === "import-tab-link") {
            try {
                data = await getJsonLink();
            } catch (e) {
                return undefined;
            }
        }
        else if (tab === "import-tab-file") {
            try {
                data = await getFileJson();
            } catch (e) {
                return undefined;
            }
        }
        return true;
    }

    function checkData() {
        if (data[0].urls.catbox[0]){
            $("#import-count-music").html(0);
            $("#import-count-total").html(data.length);
            return true;
        }
        return false;
    }

    async function getJsonLink() {
        return await jsonManClass.getJs($("#urlJson").val());
    }

    async function getFileJson() {
        const file = $('#fileJson').prop('files')[0];
        await fileReaderClass.getFileJson(file);
        return fileReaderClass.getJson();
    }

    function makeTable() {
        for (let i = 0; i < data.length; i++)
            makeRow(data[i], i);
    }

    function makeRow(obj = {}, id) {
        let row = $('<tr>').addClass('rows');

        let check = $('<input>').prop("type", 'checkbox').addClass("checkbox").prop('id', 'import-music-' + id).prop("checked", "true");
        let div = $('<div>').append(check);

        let td0 = $('<td>').html(div);
        let td1 = $('<td>').html(obj.name);
        let td2 = $('<td>').html(obj.anime.romaji);

        let audio = $('<audio>').prop("src", obj.urls.catbox[0]).prop("controls", "false").addClass("import-audio").attr("id", "import-audio-" + id);
        let td3 = $('<td>').append(audio).addClass("d-none");

        let icon = $("<i>").addClass("bi bi-play import-play-preview-icon");
        let btnPlay = $("<button>").addClass("btn mx-1 btn-outline-secondary border import-btn-play-preview rounded-pill").attr("id", 'import-music-play-' + id).append(icon);
        let td4 = $('<td>').append(btnPlay);

        let link1 = $('<a>').attr("href", "https://myanimelist.net/anime/" + obj.siteIds.malId).attr("target", "_blank").html("MyAnimeList");
        let td5 = $('<td>').append(link1);

        row.append(td0);
        row.append(td4);
        row.append(td1);
        row.append(td2);
        row.append(td3);
        row.append(td5);

        $("#import-tbody").append(row);
    }

    function btnPlay() {
        $(".import-btn-play-preview").click(function () {
            const audio = $("#import-audio-" + $(this).attr("id").split("import-music-play-")[1]);
            if (audio[0].paused) {
                $('.import-audio').each(function () {
                    this.pause();
                    this.currentTime = 0;
                });
                $(".import-play-preview-icon").each(function () {
                    $(this).removeClass("bi-pause").addClass("bi-play");
                });
                audio[0].play();
                $(this).empty().append($("<i>").addClass("bi bi-pause import-play-preview-icon"));
            } else {
                audio[0].pause();
                $(this).empty().append($("<i>").addClass("bi bi-play import-play-preview-icon"));
            }
        });
    }

    function setTime() {
        const current = new Date();

        const time = current.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour12: false
        });

        $("#import-playlist-name").val(time.replaceAll("/", "-").replaceAll(" ", "-").replaceAll(":", "-"));
    }

    function choose() {
        musicChoose = [];
        $(".checkbox").each(function () {
            const id = $(this).attr("id").split("import-music-")[1];
            if ($(this).prop('checked'))
                musicChoose[musicChoose.length] = id;
        });
    }

    function save() {
        choose();
        musicChoose.forEach(function (val, key) {
            let duration = $("#import-audio-" + val)[0].duration;
            if (!duration)
                duration = -1;
            if (key === musicChoose.length - 1)
                databaseClass.saveMusic(data[val], duration, $("#import-switch-name").prop("checked"), true, $("#import-playlist-name").val());
            else
                databaseClass.saveMusic(data[val], duration, $("#import-switch-name").prop("checked"), false, $("#import-playlist-name").val());
        });

        clear();
    }

    function clear() {
        $("#fileJson").val("");
        $("#urlJson").val("");
        $("#import-tbody").empty();
        $("#import-tab-link").click();
    }

    return {
        init,
        getNewMusic,
        save,
        clear
    }
}