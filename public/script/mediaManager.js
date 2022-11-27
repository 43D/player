
import { localStorageObject } from "./localStorageObject.js";
import { musicManager } from "./musicManager.js";
import { events } from "./events.js";

let eventsClass;
let musicManagerClass;
let localStorageObjectClass;
export function mediaManager() {
    let currentPlayList = [];
    let source = "";

    function init(config = {}) {
        eventsClass = (config.events) ? config.events : events();
        localStorageObjectClass = (config.localStorageObject) ? config.localStorageObject : localStorageObject();
        musicManagerClass = (config.musicManager) ? config.musicManager : musicManager();
        currentPlayList = localStorageObjectClass.getCurrentPlayList();
        start();
    }

    function start() {
        const config = localStorageObjectClass.getConfig();
        selectStreaming(config["streaming"]);
        setVolume(config["volume"]);
        createList();
        btnActionStart();
    }

    function play() {
        const config = localStorageObjectClass.getConfig();
        const musicId = config["playnow"];
        if (musicId == "-1") {
            firstMusic();
            play();
        } else {
            const music = musicManagerClass.getMusicById(currentPlayList[Number(musicId)]);
            setVolume(config["volume"]);
            $(".list-group-item").removeClass("list-group-item-success");
            $($("#list-play-ul").children().get(musicId)).addClass(" list-group-item-success");
            $("#title-head").html(music.name + " - " + music.artist);
            $("#name-bar").html(music.name + " - " + music.artist);

            switch (config["streaming"]) {
                case "720":
                    if (music.urls.catbox["720"])
                        playVideo(music.urls.catbox["720"]);
                    else
                        playAudio(music.urls.catbox["0"]);
                    break;
                case "480":
                    if (music.urls.catbox["480"])
                        playVideo(music.urls.catbox["480"]);
                    else
                        playAudio(music.urls.catbox["0"]);
                    break;
                default:
                    playAudio(music.urls.catbox["0"]);
                    break;
            }
        }
    }


    function skipped(id) {
        let config = localStorageObjectClass.getConfig();
        config["playnow"] = Number(id);
        localStorageObjectClass.setConfig(config);
        createNextPlay();
        createPreviewPlay();
        play();
    }

    function endPlay() {
        let config = localStorageObjectClass.getConfig();
        if (Number(config["playnext"]) > -1) {
            nextMusic();
            play();
        } else if (config["loop"]) {
            firstMusic();
            play();
        }
    }

    function previewPlay() {
        let config = localStorageObjectClass.getConfig();
        if (Number(config["playlast"]) > -1) {
            previewMusic();
            play();
        }
    }

    function nextMusic() {
        let config = localStorageObjectClass.getConfig();
        config["playlast"] = config["playnow"];
        config["playnow"] = config["playnext"];
        localStorageObjectClass.setConfig(config);
        createNextPlay();
    }

    function previewMusic() {
        let config = localStorageObjectClass.getConfig();

        config["playnext"] = config["playnow"];
        config["playnow"] = config["playlast"];
        localStorageObjectClass.setConfig(config);
        createPreviewPlay();
    }

    function playAudio(url) {
        $("#btn-video-collapse").prop("disabled", true);
        if (!$("#display-video").attr("class").includes("d-none"))
            $("#btn-video-collapse").click();
        cleanMedia();
        $("#audio").attr("src", url);
        $("#audio")[0].play();
        source = "audio";
    }

    function playVideo(url) {
        $("#btn-video-collapse").prop("disabled", false);
        cleanMedia();
        $("#video").attr("src", url);
        $("#video")[0].play();
        $("#video").prop("controls", false);
        source = "video";
    }

    function setVolume(vol = 0) {
        let config = localStorageObjectClass.getConfig();

        if (config["mute"]) {
            $("#video")[0].volume = 0;
            $("#audio")[0].volume = 0;
            $("#volume").val(0);
        } else if (vol > 0) {
            $("#video")[0].volume = vol;
            $("#audio")[0].volume = vol;
            $("#volume").val((Number(vol) * 100));
            config["volume"] = vol;
        } else {
            $("#video")[0].volume = config["volume"];
            $("#audio")[0].volume = config["volume"];
            $("#volume").val((Number(config["volume"]) * 100));
        }
        localStorageObjectClass.setConfig(config);
    }

    function createList() {
        const config = localStorageObjectClass.getConfig();
        const musicId = config["playnow"];

        $("#list-play-ul").empty();
        let i = 0;
        currentPlayList.forEach(function (k) {
            makeLi(i, musicManagerClass.getMusicById(k));
            i++
        });
        eventsClass.skippedPlay();
        $(".list-group-item").removeClass("list-group-item-success");
        $($("#list-play-ul").children().get(musicId)).addClass(" list-group-item-success");
    }

    function makeIcon(icon) {
        return $('<i>').addClass(icon);
    }

    function makeLi(id, music) {
        if (music) {
            let li = $("<li>").addClass("list-group-item");
            let row = $("<div>").addClass("row");
            let div1 = $("<div>").addClass("col-2 col-sm-1 border-end d-flex align-items-center");
            let btnPlay = $("<button>").addClass("btn w-100 skippedPlay").attr("id", "list-play-music-" + id);
            btnPlay.append(makeIcon("bi bi-play"));
            div1.append(btnPlay);

            let div2 = $("<div>").addClass("col-8 col-sm d-flex justify-content-start align-items-center").text(music.name + " - " + music.artist);
            let div3 = $("<div>").addClass("col-2 col-sm-1 d-flex align-items-center").html("00:00");

            row.append(div1);
            row.append(div2);
            row.append(div3);

            li.append(row);
            $("#list-play-ul").append(li);
        }
    }

    function selectStreaming(value = "0") {
        $("#select-quality").val(value);
    }

    function setStreaming(qld = "0") {
        localStorageObjectClass.setStreaming(qld);
    }

    function setOneTimeline(id) {
        currentPlayList = [];
        currentPlayList[0] = id;
        firstMusic();
        save();
    }
    function addOneTimeline(id) {
        if (!currentPlayList.includes(id)) {
            currentPlayList[currentPlayList.length] = id;
            createNextPlay();
            save();
        }
    }
    function setAllTimeline(array = []) {
        currentPlayList = array.join().split(',');
        firstMusic();
        createNextPlay();
        save();
    }

    function save() {
        localStorageObjectClass.setCurrentPlayList(currentPlayList);
        createList();
    }

    function cleanMedia() {
        $("#video").attr("src", "");
        $("#audio").attr("src", "");
    }

    function firstMusic() {
        let config = localStorageObjectClass.getConfig();
        config["playnow"] = 0;
        config["playnext"] = -1;
        config["playlast"] = -1;
        localStorageObjectClass.setConfig(config);
    }
    function createNextPlay() {
        let config = localStorageObjectClass.getConfig();

        const next = Number(config["playnow"]) + 1;
        if (currentPlayList[next])
            config["playnext"] = next;
        else if (config["loop"])
            config["playnext"] = 0;
        else
            config["playnext"] = -1;

        localStorageObjectClass.setConfig(config);
    }

    function createPreviewPlay() {
        let config = localStorageObjectClass.getConfig();

        const next = Number(config["playnow"]) - 1;
        if (currentPlayList[next])
            config["playlast"] = next;
        else if (config["loop"])
            config["playlast"] = currentPlayList.length - 1;
        else
            config["playlast"] = -1;

        localStorageObjectClass.setConfig(config);
    }

    function isPlay() {
        if (!$("#video")[0].paused)
            return true;
        if (!$("#audio")[0].paused)
            return true;
        return false;
    }

    function actionPlay() {
        if (source == "audio")
            if (isPlay())
                $("#audio")[0].pause();
            else
                $("#audio")[0].play();
        else if (source == "video")
            if (isPlay())
                $("#video")[0].pause();
            else
                $("#video")[0].play();
        else {
            firstMusic();
            createNextPlay();
            play();
        }

    }

    function actionLoop() {
        let config = localStorageObjectClass.getConfig();
        config["loop"] = (config["loop"]) ? false : true;
        localStorageObjectClass.setConfig(config);
        return config["loop"];
    }

    function btnActionStart() {
        const config = localStorageObjectClass.getConfig();
        if (config["loop"])
            $("#btn-loop").removeClass("btn-outline-secondary").addClass("btn-success");
        else
            $("#btn-loop").removeClass("btn-success").addClass("btn-outline-secondary");
        if (config["mute"])
            $("#volume-mute").removeClass("btn-outline-secondary").addClass("btn-danger");
        else
            $("#volume-mute").removeClass("btn-danger").addClass("btn-outline-secondary");

    }

    function actionMute() {
        let config = localStorageObjectClass.getConfig();
        config["mute"] = (config["mute"]) ? false : true;
        localStorageObjectClass.setConfig(config);
        return config["mute"];
    }

    function shuffle() {
        currentPlayList = shuffleArray(currentPlayList);

        firstMusic();
        createNextPlay();
        save();
        if (isPlay())
            play();
    }

    function shuffleArray(array) {
        let currentIndex = array.length;
        let randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }

    return {
        init,
        setStreaming,
        setOneTimeline,
        addOneTimeline,
        setAllTimeline,
        setVolume,
        play,
        endPlay,
        previewPlay,
        actionPlay,
        actionLoop,
        actionMute,
        shuffle,
        skipped
    }
}