import { eventos } from "./events.js";
import { display } from "./display.js";
import { theme } from "../theme.js";
import { jsonManipulator } from "../jsonManipulator.js";
import { fileReader } from "../fileReader.js";
import { localStorageObject } from "../localStorageObject.js";
import { defaultConfigs } from "../defaultConfigs.js";
import { saveJson } from "./saveJson.js";

let saveJsonClass;
let defaultConfigsClass;
let fileReaderClass;
let jsonManClass;
let eventsClass;
let displayClass;
let themeClass;
let localStorageObjectClass;
export function importJson() {

    let data;
    let musicChoose;

    function init() {
        defaultConfigsClass = defaultConfigs();
        defaultConfigsClass.init();
        themeClass = theme();
        displayClass = display();
        eventsClass = eventos();
        eventsClass.init({ displayClass, 'importJson': this });
        eventsClass.start();
        jsonManClass = jsonManipulator();
        fileReaderClass = fileReader();
        localStorageObjectClass = localStorageObject();
        saveJsonClass = saveJson();
        saveJsonClass.init();

    }

    function confirmar() {
        displayClass.exibirList();
    }
    function getJson() {
        return getJsonAMQ();
    }

    function setList(list = {}) {
        data = list;
    }

    function makeTable() {
        makeTables().make(data);
    }

    function setChoose(obj = {}) {
        musicChoose = obj;
    }

    function saveList(){
        const playlist = $("#newPlaylist").is(':checked');
        const name = $("#newPlaylistName").val();
        saveJsonClass.make(data, musicChoose, playlist, name);
    }

    return {
        init,
        confirmar,
        getJson,
        setList,
        makeTable,
        setChoose,
        saveList
    }
}

function makeTables() {
    function make(data = {}) {
        for (let i = 0; i < data.length; i++)
            makeRow(data[i], i);
    }

    function makeRow(obj = {}, id) {
        var row = $('<tr>').addClass('rows');


        var check = $('<input>').prop("type", 'checkbox').addClass("checkbox").prop('id', 'music-' + id).prop("checked", "true");
        var div = $('<div>').append(check);

        var td0 = $('<td>').html(div);
        var td1 = $('<td>').html(obj.name);
        var td2 = $('<td>').html(obj.anime.romaji);

        var audio = $('<audio>').prop("src", obj.urls.catbox[0]).prop("controls", "true");
        var td3 = $('<td>').append(audio);

        var td4 = $('<td>');
        var link1 = $('<a>').attr("href", "https://myanimelist.net/anime/" + obj.siteIds.malId).attr("target", "_blank").html("MyAnimeList");
        td4.append(link1);

        row.append(td0);
        row.append(td1);
        row.append(td2);
        row.append(td3);
        row.append(td4);

        $("#tbody").append(row);
    }

    return {
        make
    }
}

function getJsonAMQ() {
    let data;

    async function getAMQ() {
        try {
            data = await getJsonLink();

        } catch (e) {
            try {
                data = await getFileJson();
            } catch (e) {
                return undefined;
            }
        }
        return data;
    }

    async function getJsonLink() {
        return await jsonManClass.getJs($("#urlJson").val());
    }

    async function getData() {
        return data;
    }

    async function getFileJson() {
        const file = $('#fileJson').prop('files')[0];
        await fileReaderClass.getFileJson(file);
        return fileReaderClass.getJson();
    }

    return {
        getAMQ,
        getData
    }
}