import { localStorageObject } from "./localStorageObject.js";
import { events } from "./events.js";

let eventsClass;
let localStorageClass;

export function search() {

    let musics = {};
    let playlist = {};

    function init(config = {}) {
        localStorageClass = (config.localStorageObject) ? config.localStorageObject : localStorageObject();
        eventsClass = (config.events) ? config.events : events();
        musics = localStorageClass.getMusics();
        playlist = localStorageClass.getPlayLists();
    }

    function start() {
        const strings = $("#search-value").val().split(" ");
        $("#display-search").empty();

        if (strings[0] != "") {
            search(strings);
            eventsClass.btnsSeacrh();
        }
        else
            notFound();
    }

    function search(strings) {
        let list = [];

        Object.keys(musics).forEach(function (key) {
            let s = true;

            strings.forEach(function (v, k) {
                if (s) {
                    if (musics[key].name.toUpperCase().includes(v.toUpperCase())) {
                        list[key] = musics[key];
                        s = false;
                        return;
                    }
                    if (musics[key].artist.toUpperCase().includes(v.toUpperCase())) {
                        list[key] = musics[key];
                        s = false;
                        return;
                    }
                    if (musics[key].anime.romaji.toUpperCase().includes(v.toUpperCase())) {
                        list[key] = musics[key];
                        s = false;
                        return;
                    }
                    if (musics[key].anime.english.toUpperCase().includes(v.toUpperCase())) {
                        list[key] = musics[key];
                        s = false;
                        return;
                    }
                    if (musics[key].year.toUpperCase().includes(v.toUpperCase())) {
                        list[key] = musics[key];
                        s = false;
                        return;
                    }
                }

            });
            s = true;
        });
        makeDisplay(list);
    }

    function notFound() {
        const h4 = $("<h4>").addClass("text-center mt-4").html("Digite algo para pesquisar!!!");
        const p = $("<p>").addClass("text-center").html("Ex: Música, artista, anime, ano, etc...");
        $("#display-search").append(h4);
        $("#display-search").append(p);
    }

    function makeDisplay(list) {
        list.forEach(function (v, k) {
            makeList(k, v);
        });
    }

    function makeList(id, music) {
        let mainDiv = $("<div>");
        let ul = $("<ul>").addClass("list-group");
        let li = $("<li>").addClass("list-group-item");
        let row = makeMenu(id, music);
        let table = makeTable(id, music);
        li.append(row);
        li.append(table);
        ul.append(li);
        mainDiv.append(ul);
        $("#display-search").append(mainDiv);
    }

    function makeMenu(id, music) {
        let divRow = $("<div>").addClass("row");

        let div1 = $("<div>").addClass("col-2 col-sm-1 border-end  d-flex align-items-center");
        let btn = $('<button>').addClass("btn w-100 playNow").attr("id", "search-music-" + id);
        btn.append(makeIcon("bi bi-play"));
        div1.append(btn);
        divRow.append(div1);

        let div2 = $("<div>").addClass("col-10 col-sm d-flex justify-content-start align-items-center").attr("data-bs-toggle", "collapse").attr("data-bs-target", "#collapse-search-" + id);
        let name = $("<span>").text(music.name);
        div2.append(name);
        divRow.append(div2);

        let div3 = $("<div>").addClass("col-10 col-sm-3 col-lg-2 d-flex align-items-center").attr("data-bs-toggle", "collapse").attr("data-bs-target", "#collapse-search-" + id);
        let qtd = $("<span>").text("00:00");
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

        ul.append(makeLiDropdown("addMusic", "bi bi-collection", "Adicionar na fila", "search-add-music-" + id));
        ul.append(makeLiDropdown("playlistAdd", "bi bi-journal-plus", "Adicionar a uma PlayList", "search-playlist-music-" + id).attr("data-bs-toggle", "modal").attr("data-bs-target", "#addPlaylistModal"));
        ul.append(makeLiDropdown("", "bi bi-collection", "Exibir informações").attr("data-bs-toggle", "collapse").attr("data-bs-target", "#collapse-search-" + id));
        ul.append(makeLiDropdown("downloadMusic", "bi bi-box-arrow-down", "JSON", "search-down-music-" + id));

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

    function makeIcon(icon) {
        return $('<i>').addClass(icon);
    }

    function makeTable(id, music) {
        let div = $("<div>").addClass("collapse").attr("id", "collapse-search-" + id);
        let table = $("<table>").addClass("table table-striped table-hover");
        let tbody = $("<tbody>");

        let tr1 = makeTr();
        let th1 = makeTh("Música");
        let td1 = makeTd(music.name);
        let th2 = makeTh("Artista");
        let td2 = makeTd(music.artist);
        tr1.append(th1);
        tr1.append(td1);
        tr1.append(th2);
        tr1.append(td2);
        tbody.append(tr1);

        let tr2 = makeTr();
        let th3 = makeTh("Tipo");
        let td3 = makeTd(music.type);
        let th4 = makeTh("Temporada");
        let td4 = makeTd(music.season);
        tr2.append(th3);
        tr2.append(td3);
        tr2.append(th4);
        tr2.append(td4);
        tbody.append(tr2);

        let tr3 = makeTr();
        let th5 = makeTh("Anime");
        let td5 = makeTd(music.anime.romaji);
        let td6 = makeTd(music.anime.english).attr("colspan", "2");
        tr3.append(th5);
        tr3.append(td5);
        tr3.append(td6);
        tbody.append(tr3);

        let tr4 = makeTr();
        let th6 = makeTh("Links");
        let link = $("<a>").attr("href", "https://myanimelist.net/anime/" + music.malID).attr("target", "_blank").html("MyAnimeList");
        let td7 = makeTdObj(link);
        tr4.append(th6);
        tr4.append(td7);
        tbody.append(tr4);

        table.append(tbody);
        div.append(table);
        return div;
    }

    function makeTr() {
        return $("<tr>");
    }
    function makeTh(value) {
        return $("<th>").html(value);
    }
    function makeTd(value) {
        return $("<td>").text(value);
    }
    function makeTdObj(obj) {
        return $("<td>").append(obj);
    }

    return {
        init,
        start
    }
}