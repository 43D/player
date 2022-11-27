import { localStorageObject } from "../localStorageObject.js";
import { events } from "./events.js";

let eventsClass;
let localStorageClass;

export function playlistManager() {

    let musics = {};
    let playlist = {};

    function init(config = {}) {
        localStorageClass = (config.localStorageObject) ? config.localStorageObject : localStorageObject();
        eventsClass = (config.events) ? config.events : events();
        musics = localStorageClass.getMusics();
        playlist = localStorageClass.getPlayLists();
        start();
    }

    function newPlayList(name) {
        const play = { "name": name, musics: [] };
        const keys = Object.keys(playlist);
        let id = (Number(keys[keys.length - 1]) + 1).toString();
        if (id == 'NaN')
            id = "1";
        makeObj(playlist, id, play);
        localStorageClass.setPlayLists(playlist);
        reload();
    }


    function makeObj(obj, key, value) {
        if (obj[key]) {
            obj[key][obj[key].length] = value;
        } else {
            obj[key] = [value];
        }
    }

    function reload() {
        $("#display-playlist").empty();
        musics = localStorageClass.getMusics();
        playlist = localStorageClass.getPlayLists();
        start();
    }

    function start() {
        const keys = Object.keys(playlist);

        if (keys.length == 0)
            addWarning("display-playlist");
        else {
            $("#select-playlist-add").empty().prop("disabled", true);
            keys.sort().forEach(function (k) {
                let listMusics = [];
                let finalList = [];
                playlist[k][0].musics.forEach(function (j) {
                    const name = getNameItem(j);
                    if (name)
                        listMusics[listMusics.length] = name;
                });
                Object.keys(listMusics).forEach(function (j) {
                    finalList[finalList.length] = Object.keys(listMusics[j])[0];
                });
                makeList(k, playlist[k][0], finalList);
                makeOptionAddPlaylist(k, playlist[k][0].name);
            });
            eventsClass.btnsPlaylists();
        }

    }

    function addWarning(id) {
        const h4 = $("<h4>").addClass("text-center mt-4").html("Não a nada aqui, acesse Import");
        $("#" + id).append(h4);
    }

    function getNameItem(key) {
        if (musics[key]) {
            let json = {};
            json[key] = musics[key].name;
            return json;
        }
        return undefined;
    }

    function makeIcon(icon) {
        return $('<i>').addClass(icon);
    }

    function compareMusic(a, b) {
        a = a.toUpperCase();
        b = b.toUpperCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

    function makeList(id, playlist, finalList) {
        const display = $("#display-playlist");

        let mainDiv = $("<div>");
        let ul = $("<ul>").addClass("list-group");
        let li = $("<li>").addClass("list-group-item");
        let row = makeMenu(id, playlist.name, finalList.length);
        let table = makeTable(id, finalList);
        li.append(row);
        li.append(table);
        ul.append(li);
        mainDiv.append(ul);
        display.append(mainDiv);
    }

    function makeMenu(id, title, qtdMusic) {
        let divRow = $("<div>").addClass("row");

        let div1 = $("<div>").addClass("col-2 col-sm-1 border-end  d-flex align-items-center");
        let btn = $('<button>').addClass("btn w-100 playlistNow").attr("id", "playlist-id-" + id);
        btn.append(makeIcon("bi bi-play"));
        div1.append(btn);
        divRow.append(div1);

        let div2 = $("<div>").addClass("col-10 col-sm d-flex justify-content-start align-items-center").attr("data-bs-toggle", "collapse").attr("data-bs-target", "#collapse-playlist-" + id);
        let name = $("<span>").text(title);
        div2.append(name);
        divRow.append(div2);

        let div3 = $("<div>").addClass("col-10 col-sm-3 col-lg-2 d-flex align-items-center").attr("data-bs-toggle", "collapse").attr("data-bs-target", "#collapse-playlist-" + id);
        let qtd = $("<span>").text(qtdMusic + " músicas");
        div3.append(qtd);
        divRow.append(div3);

        let div4 = $("<div>").addClass("col-2 col-sm-1 border-start d-flex align-items-center justify-content-end");
        let btnMenu = $('<button>').addClass("btn w-100").attr("data-bs-toggle", "dropdown").attr("aria-expanded", "false");
        btnMenu.append(makeIcon("bi bi-three-dots"));
        div4.append(btnMenu);
        div4.append(makeOptionMusicList(id));
        divRow.append(div4);


        return divRow;
    }

    function makeOptionMusicList(id) {
        let ul = $("<ul>").addClass("dropdown-menu").attr("style", "z-index: 1035;");

        ul.append(makeLiDropdown("", "bi bi-collection", "Exibir músicas").attr("data-bs-toggle", "collapse").attr("data-bs-target", "#collapse-playlist-" + id));
        ul.append(makeLiDropdown("downPlaylist", "bi bi-box-arrow-down", "JSON", "playlist-down-" + id));
        ul.append(makeLiDropdown("editPlaylist", "bi bi-pencil", "Editar", "playlist-edit-" + id).attr("data-bs-toggle", "modal").attr("data-bs-target", "#editPlaylistModal"));
        ul.append(makeLiDropdown("duplicatePlaylist", "bi bi-clipboard2", "Duplicar", "playlist-duplicate-" + id));
        ul.append(makeLiDropdown("removePlaylist", "bi bi-x-lg", "Remover", "playlist-remove-" + id));
        return ul;
    }

    function makeLiDropdown(classe, icon, title, id = "") {
        let li = $("<li>");
        let a = $("<a>").addClass("dropdown-item " + classe).attr("href", "#").attr("id", id);
        a.append(makeIcon(icon));
        a.html(a.html() + " " + title);

        li.append(a);
        return li;
    }

    function makeTable(id, finalList) {
        let div = $("<div>").addClass("collapse").attr("id", "collapse-playlist-" + id);
        let table = $("<table>").addClass("table table-striped table-hover");
        let tbody = $("<tbody>");

        let i = 1;
        finalList.forEach(function (k) {
            let t = makeRow(i, k);
            tbody.append(t);
            i++;
        });
        table.append(tbody);
        div.append(table);
        return div;
    }

    function makeRow(i, id) {
        let tr = $("<tr>");
        let th = $("<th>").html("#" + i);
        let td1 = $("<td>").html(musics[id].name);
        let td2 = $("<td>").html(musics[id].artist);
        let td3 = $("<td>").html(musics[id].time);
        tr.append(th);
        tr.append(td1);
        tr.append(td2);
        tr.append(td3);
        return tr;
    }

    function makeOptionAddPlaylist(id, name) {
        const option = $("<option>").val(id).html(name);
        $("#select-playlist-add").append(option).prop("disabled", false);
    }

    function save() {
        localStorageClass.setPlayLists(playlist);
    }

    function addPlaylistById(id, music) {
        let array = playlist[id][0].musics;
        if (!array.includes(music)) {
            array[array.length] = music;
            playlist[id][0].musics = array;
            save();
            reload();
        }
    }

    function makeTime() {
        const current = new Date();

        const time = current.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
            hour12: false
        });

        return time.replaceAll("/", "-").replaceAll(" ", "-").replaceAll(":", "-");
    }

    function clonePlaylist(id) {
        let play = { ...playlist[id][0] };
        play.name = play.name + makeTime();
        const keys = Object.keys(playlist);
        let newId = (Number(keys[keys.length - 1]) + 1).toString();
        if (newId == 'NaN')
            newId = "1";
        makeObj(playlist, newId, play);
        localStorageClass.setPlayLists(playlist);
        reload();
    }

    function removeById(id) {
        delete playlist[id];
        localStorageClass.setPlayLists(playlist);
        reload();
    }

    function editById(id) {
        $("#id-playlist-edit").val(id);
        $("#name-playlist-edit").val(playlist[id][0].name);
        $("#checks").empty();
        playlist[id][0].musics.forEach(function (k) {
            if (musics[k]) {
                addCheckboxEdit(k, musics[k].name);
            }
        });
    }

    function addCheckboxEdit(id, name) {
        let div = $("<div>").addClass("form-check mt-2 px-3 py-4 border");
        let inp = $("<input>").addClass("form-check-input checkboxPlaylistEdit ms-1 me-2").attr("type", "checkbox").attr("id", "checkbox-playlist-edit-" + id).val(id).prop("checked", true);
        let lbl = $("<label>").addClass("form-check-label").attr("for", "checkbox-playlist-edit-" + id).html(name);
        div.append(inp);
        div.append(lbl);
        $("#checks").append(div);
    }

    function editPlaylistForm() {
        const id = $("#id-playlist-edit").val();
        const name = $("#name-playlist-edit").val();
        const elMusics = $(".checkboxPlaylistEdit");
        let finalmusics = [];
        elMusics.each(function (index, element) {
            finalmusics[finalmusics.length] = element.value;
        });

        const play = { "name": name, musics: finalmusics };

        playlist[id][0] = play;
        localStorageClass.setPlayLists(playlist);
        reload();
    }

    function getAllById(id){
        return playlist[id][0].musics;
    }

    return {
        init,
        newPlayList,
        reload,
        addPlaylistById,
        clonePlaylist,
        removeById,
        editById,
        editPlaylistForm,
        getAllById
    }
}