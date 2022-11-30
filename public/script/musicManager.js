import { localStorageObject } from "./localStorageObject.js";
import { events } from "./events.js";

let eventsClass;
let localStorageClass;

export function musicManager() {
    let musics = {};
    let musicsByAnime = {};
    let musicsByName = {};
    let musicsBySeason = {};

    function init(config = {}) {
        localStorageClass = (config.localStorageObject) ? config.localStorageObject : localStorageObject();
        eventsClass = (config.events) ? config.events : events();
        musics = localStorageClass.getMusics();
        musicsByAnime = localStorageClass.getMusicsAnime();
        musicsByName = localStorageClass.getMusicsName();
        musicsBySeason = localStorageClass.getMusicsSeason();
        start();
    }

    function reload() {
        $("#display-music-name").empty();
        $("#display-music-anime").empty();
        $("#display-music-season").empty();
        musics = localStorageClass.getMusics();
        musicsByAnime = localStorageClass.getMusicsAnime();
        musicsByName = localStorageClass.getMusicsName();
        musicsBySeason = localStorageClass.getMusicsSeason();
        start();
    }

    function start() {
        makeItensMusic("display-music-name", musicsByName, "name");
        makeItensMusic("display-music-anime", musicsByAnime, "anime");
        makeItensMusic("display-music-season", musicsBySeason, "season");
        eventsClass.btnsMusics();
    }

    function makeItensMusic(id, musicsId, typeList) {
        let list = [];
        const keys = Object.keys(musicsId);

        if (keys.length == 0)
            addWarning(id);
        else
            keys.sort().forEach(function (k) {
                let listMusics = [];
                musicsId[k].forEach(function (j) {
                    listMusics[listMusics.length] = getNameItem(j);
                });
                listMusics.sort(function (a, b) {
                    return compareMusic(a[Object.keys(a)[0]], b[Object.keys(b)[0]]);
                });
                listMusics.forEach(function (j) {
                    list[list.length] = makeItem(Object.keys(j)[0], typeList);
                });

                if (musics[musicsId[k][0]])
                    if (typeList == "anime")
                        makeList(id, list, musics[musicsId[k][0]].anime.romaji, musics[musicsId[k][0]].anime.english);
                    else if (typeList == "season")
                        makeList(id, list, musics[musicsId[k][0]].season);
                    else
                        makeList(id, list, k);

                list = [];
            });

    }

    function getMusicById(id) {
        return musics[id];
    }

    function getNameItem(idMusic) {
        let json = {};
        json[idMusic] = musics[idMusic].name;
        return json;
    }

    function makeItem(idMusic, typeList) {
        let li = $("<li>").addClass("list-group-item themeClear");
        let divRow = makeMenuMusic(idMusic, typeList);
        li.append(divRow);

        let div = makeTableMusicList("music-" + typeList + idMusic, idMusic);
        li.append(div);

        return li;
    }

    function makeIcon(icon) {
        return $('<i>').addClass(icon);
    }

    function addWarning(id) {
        const h4 = $("<h4>").addClass("text-center mt-4").html("Não a nada aqui, acesse 'Importar Json'");
        $("#" + id).append(h4);
    }

    function makeMenuMusic(idMusic, typeList) {
        let divRow = $("<div>").addClass("row");
        const music = musics[idMusic];

        let div1 = $("<div>").addClass("col-2 col-sm-1 border-end  d-flex align-items-center");
        let btn = $('<button>').addClass("btn themeClearLink w-100 playNow").attr("id", typeList + "-music-" + idMusic);
        btn.append(makeIcon("bi bi-play"));
        div1.append(btn);
        divRow.append(div1);

        let div2 = $("<div>").addClass("col-10 col-sm d-flex justify-content-start align-items-center").attr("data-bs-toggle", "collapse").attr("data-bs-target", "#music-" + typeList + idMusic);
        let name = $("<span>").text(music.name);
        div2.append(name);
        divRow.append(div2);

        let div3 = $("<div>").addClass("col-10 col-sm-2 col-lg-1 d-flex align-items-center").attr("data-bs-toggle", "collapse").attr("data-bs-target", "#music-" + typeList + idMusic);
        let time = $("<span>").text("00:00");
        div3.append(time);
        divRow.append(div3);

        let div4 = $("<div>").addClass("col-2 col-sm-1 d-flex align-items-center justify-content-end border-start");
        let btnMenu = $('<button>').addClass("btn themeClearLink w-100").attr("data-bs-toggle", "dropdown").attr("aria-expanded", "false");
        btnMenu.append(makeIcon("bi bi-three-dots"));
        div4.append(btnMenu);
        div4.append(makeOptionMusicList(idMusic, typeList));
        divRow.append(div4);

        return divRow;
    }

    function makeOptionMusicList(idMusic, typeList) {
        let ul = $("<ul>").addClass("dropdown-menu themeClear").attr("style", "z-index: 1035;");

        ul.append(makeLiDropdown("addMusic", "bi bi-collection", "Adicionar na fila", typeList + "-add-music-" + idMusic));
        ul.append(makeLiDropdown("playlistAdd", "bi bi-journal-plus", "Adicionar a uma PlayList", typeList + "-playlist-music-" + idMusic).attr("data-bs-toggle", "modal").attr("data-bs-target", "#addPlaylistModal"));
        ul.append(makeLiDropdown("", "bi bi-collection", "Exibir informações").attr("data-bs-toggle", "collapse").attr("data-bs-target", "#music-" + typeList + idMusic));
        ul.append(makeLiDropdown("downloadMusic", "bi bi-box-arrow-down", "JSON", typeList + "-down-music-" + idMusic));
        ul.append(makeLiDropdown("removeMusic", "bi bi-x-lg", "Remover", typeList + "-remove-music-" + idMusic));


        return ul;
    }

    function makeLiDropdown(classe, icon, title, id = "") {
        let li = $("<li>");
        let a = $("<a>").addClass("dropdown-item  themeClearLink themeClearMenu " + classe).attr("href", "#").attr("id", id);
        a.append(makeIcon(icon));
        a.html(a.html() + " " + title);

        li.append(a);
        return li;
    }

    function makeTableMusicList(id, idMusic) {
        const music = musics[idMusic];

        let div = $("<div>").addClass("collapse").attr("id", id);
        let table = $("<table>").addClass("table");
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
        return $("<tr>").addClass("themeClearLink themeClearMenu");
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

    function makeList(id, li = [$("<li>")], title, subTitle = "") {
        let mainDiv = $("<div>");
        let h4 = $("<h4>").addClass("mt-4 ms-3").html(title);
        let h6 = $("<h6>").addClass("mb-2 ms-3").html(subTitle);
        mainDiv.append(h4);
        if (subTitle != "")
            mainDiv.append(h6);

        let ul = $("<ul>").addClass("list-group");
        for (let i = 0; i < li.length; i++)
            ul.append(li[i]);
        mainDiv.append(ul);

        $("#" + id).append(mainDiv);
    }

    function compareMusic(a, b) {
        a = a.toUpperCase();
        b = b.toUpperCase();
        return (a < b) ? -1 : (a > b) ? 1 : 0;
    }

    function getSeasn(string) {
        const season = string.split(" ")[1] + "-";
        switch (string.split(" ")[0]) {
            case "Winter":
                return season + "01";
            case "Spring":
                return season + "02";
            case "Summer":
                return season + "03";
            case "Fall":
                return season + "04";
            default:
                return undefined;
        }
    }

    function removeById(id) {
        const malId = musics[id].malID;
        const season = getSeasn(musics[id].season);
        const char = musics[id].name[0].toUpperCase();
        delete musics[id];
        musicsByAnime[malId] = removeArray(musicsByAnime[malId], id);
        musicsByName[char] = removeArray(musicsByName[char], id);
        musicsBySeason[season] = removeArray(musicsBySeason[season], id);
        save();
        reload();
    }

    function removeArray(json, id) {
        let list = [];
        json.forEach(function (k) {
            if (k != id)
                list[list.length] = k;
        });
        return list;
    }

    function save() {
        localStorageClass.setMusicsAnime(musicsByAnime);
        localStorageClass.setMusicsName(musicsByName);
        localStorageClass.setMusicsSeason(musicsBySeason);
        localStorageClass.setMusics(musics);
    }

    return {
        init,
        reload,
        removeById,
        getMusicById
    }
}