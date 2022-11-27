import { localStorageObject } from "../localStorageObject.js";

let localStorageClass;

export function saveJson() {
    let allMusics = {};
    let allMusicsByAnime = {};
    let allMusicsByName = {};
    let allMusicsBySeason = {};

    function init(config = {}) {
        localStorageClass = (config.localStorageObject) ? config.localStorageObject : localStorageObject();
    }

    function getMusics(){
        allMusics = localStorageClass.getMusics();
        allMusicsByAnime = localStorageClass.getMusicsAnime();
        allMusicsByName = localStorageClass.getMusicsName();
        allMusicsBySeason = localStorageClass.getMusicsSeason();
    }

    function make(obj, objChoose, playlist, name) {
        getMusics();
        let list = [];

        for (let i = 0; i < objChoose.length; i++) {
            if (objChoose[i])
                list[i] = add(obj[i]);
        }
        saveMusic();
        if (playlist)
            savePlayList(list, name);
    }

    function add(music) {
        const malId = music.siteIds.malId.toString();
        if (allMusicsByAnime[malId] != undefined) {
            for (let i = 0; i < Object.keys(allMusicsByAnime[malId]).length; i++) {
                if (allMusics[allMusicsByAnime[malId][i]].name == music.name)
                    return allMusicsByAnime[malId][i];
            }
        }
        return makeMusic(music, malId);
    }

    function makeMusic(music, malId) {
        const keys = Object.keys(allMusics);
        let id = Number(keys[keys.length - 1]) + 1;
        const char = music.name[0].toUpperCase();
        let season = music.vintage.split(" ")[1] + "-" + seasonNumber(music.vintage.split(" ")[0]);

        if (!id)
            id = 0;

        makeMusicById(id, music, malId);
        makeObj(allMusicsByAnime, malId, id);
        makeObj(allMusicsByName, char, id);
        makeObj(allMusicsBySeason, season, id);

        return id;
    }

    function seasonNumber(string) {
        if (string.toUpperCase() == "WINTER")
            return "01";
        if (string.toUpperCase() == "SPRING")
            return "02";
        if (string.toUpperCase() == "SUMMER")
            return "03";
        if (string.toUpperCase() == "FALL")
            return "04";
    }

    function makeMusicById(id, music, malId) {
        const finalMusic = {
            "name": music.name,
            "artist": music.artist,
            "season": music.vintage,
            "year": music.vintage.split(" ")[1],
            "anime": music.anime,
            "urls": music.urls,
            "malID": malId,
            "type": music.type,
            "broadcast": music.animeType
        }

        allMusics[id] = finalMusic;
    }

    function makeObj(obj, key, value) {
        if (obj[key]) {
            obj[key][obj[key].length] = value
        } else {
            obj[key] = [value];
        }
    }


    function saveMusic() {
        localStorageClass.setMusics(allMusics);
        localStorageClass.setMusicsAnime(allMusicsByAnime);
        localStorageClass.setMusicsName(allMusicsByName);
        localStorageClass.setMusicsSeason(allMusicsBySeason);
    }

    function savePlayList(list, name = "playlist") {
        const finalPlaylist = {
            "name": name,
            "musics": list
        };
        let playlist = localStorageClass.getPlayLists();
        const keys = Object.keys(playlist);
        let id = (Number(keys[keys.length - 1]) + 1).toString();
        if (id == 'NaN')
            id = "1";
        makeObj(playlist, id, finalPlaylist);
        localStorageClass.setPlayLists(playlist);
    }
    return {
        make,
        init
    }
}