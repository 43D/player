import { display } from "./display.js";
import { player } from "./player.js";
import { musicManager } from "./musicManager.js";
import { playlistManager } from "./playlistManager.js";
import { mediaManager } from "./mediaManager.js";

let mediaManagerClass
let musicManagerClass;
let playlistManagerClass;
let displayClass;
let playerClass;

export function events() {
    let mouseUp = true;

    function init(config = {}) {
        displayClass = (config.display) ? config.display : display();
        playerClass = (config.player) ? config.player : player();
        musicManagerClass = (config.musicManager) ? config.musicManager : musicManager();
        playlistManagerClass = (config.playlistManager) ? config.playlistManager : playlistManager();
        mediaManagerClass = (config.mediaManager) ? config.mediaManager : mediaManager();
    }

    function start() {
        createButtonAction();
        muteActionMod();
        btnAddPlaylistById();
        createButtonCollapse();
        btnPlaylist();
        playlist();
        reload();
        search();
        clear();
        selectQuality();
        btnMedia();
        radioImport();
    }

    function btnMedia() {
        changeVolume();
        mediaEnd();
        timelineUpdate();
        mouseTimeline();
        touchTimeline();
        btnNext();
        btnPreview();
        btnPlay();
        btnLoop();
        btnMute();
        btnShuffle();
        skippedPlay();
    }

    function btnsMusics() {
        playMusic();
        addPlayMusic();
        addPlaylist();
        downloadMusic();
        removeMusic();
    }

    function btnsPlaylists() {
        playPlaylist();
        downloadPlaylist();
        editPlaylist();
        duplicatePlaylist();
        removePlaylist();
        sortablePlaylist();
    }

    function btnsSeacrh() {
        btnsMusics();
    }

    function muteActionMod() {
        $('#volume-mute').click(function (e) {
            e.stopPropagation();
        });
    }

    function createButtonCollapse() {
        buttonCollapse("btn-video-collapse", "display-video", "collapseVideo");
        buttonCollapse("btn-list-collapse", "display-list", "list-collapse");
    }

    function createButtonAction() {
        buttonAction("music-name", "display-music-name");
        buttonAction("music-anime", "display-music-anime");
        buttonAction("music-season", "display-music-season");
        buttonAction("playlist", "display-playlist");
        buttonAction("btn-json-fast", "display-json-fast");
    }

    function buttonAction(btn = "", id = "") {
        $("#" + btn).click(function () {
            $("#musicbarNav").removeClass("show");
            displayClass.displayShowById(id);
        });
    }

    function buttonCollapse(btn = "", idDisplay = "", collapse = "") {
        $("#" + btn).click(function () {
            $("#" + collapse).show();
            displayClass.displayMainShowById(idDisplay);
        });
    }

    function btnPlaylist() {
        $("#new-playlist").click(function () {
            $("#musicbarNav").removeClass("show")
            displayClass.displayShowById("display-new-playlist");
            displayClass.showById("new-playlist-child");
            displayClass.hiddenById("finish-playlist-child");
        });
    }

    function playlist() {
        $("#btnSaveNewPlaylist").click(function () {
            if ($("#newPlaylistName").val() != "") {
                displayClass.hiddenById("new-playlist-child");
                displayClass.showById("finish-playlist-child");
                playerClass.newPlayList($("#newPlaylistName").val());
            }
        });
    }

    function actionUrl(url) {
        switch (url) {
            case "json":
                $("#btn-json-fast").click();
                break;
            case "music-name":
                $("#music-name").click();
                break;
            case "music-anime":
                $("#music-anime").click();
                break;
            case "music-season":
                $("#music-season").click();
                break;
            case "playlist":
                $("#playlist").click();
                break;
            case "new-playlist":
                $("#new-playlist").click();
                break;
            case "search":
                $("#btn-search").click();
                break;
            default:
                $("#music-name").click();
                break;
        }
    }

    function reload() {
        $("#reload").click(function () {
            $("#musicbarNav").removeClass("show");
            playerClass.reload();
        });
    }

    function search() {
        $("#btn-search").click(function () {
            $("#musicbarNav").removeClass("show");
            displayClass.displayShowById("display-search");
            playerClass.searchAction();
        });
    }

    function clear() {
        $("#btn-clear-data").click(function () {
            playerClass.clearData();
        });
    }

    function playMusic() {
        $(".playNow").click(function () {
            const id = this.id.split("-music-")[1];
            mediaManagerClass.setOneTimeline(id);
            mediaManagerClass.play();
        });
    }

    function addPlayMusic() {
        $(".addMusic").click(function () {
            const id = this.id.split("-add-music-")[1];
            mediaManagerClass.addOneTimeline(id);
        });
    }

    function addPlaylist() {
        $(".playlistAdd").click(function () {
            const id = this.id.split("-playlist-music-")[1];
            $("#id-playlist-add").val(id);

        });
    }

    function btnAddPlaylistById() {
        $("#btn-playlist-add").click(function () {
            const id = $("#select-playlist-add option:selected").val();
            const music = $("#id-playlist-add").val();
            playlistManagerClass.addPlaylistById(id, music);
        });
    }

    function btnAddPlaylistById() {
        $("#btn-playlist-edit").click(function () {
            playlistManagerClass.editPlaylistForm();
        });
    }


    function downloadMusic() {
        $(".downloadMusic").click(function () {
            const id = this.id.split("-down-music-")[1];
        });
    }
    function removeMusic() {
        $(".removeMusic").click(function () {
            const id = this.id.split("-remove-music-")[1];
            musicManagerClass.removeById(id);
            playlistManagerClass.reload();
        });
    }

    function playPlaylist() {
        $(".playlistNow").click(function () {
            const id = this.id.split("playlist-id-")[1];
            mediaManagerClass.setAllTimeline(playlistManagerClass.getAllById(id));
            mediaManagerClass.play();
        });
    }

    function downloadPlaylist() {
        $(".downPlaylist").click(function () {
            const id = this.id.split("playlist-down-")[1];
        });
    }
    function duplicatePlaylist() {
        $(".duplicatePlaylist").click(function () {
            const id = this.id.split("playlist-duplicate-")[1];
            playlistManagerClass.clonePlaylist(id);
        });
    }
    function editPlaylist() {
        $(".editPlaylist").click(function () {
            const id = this.id.split("playlist-edit-")[1];
            playlistManagerClass.editById(id);
        });
    }
    function removePlaylist() {
        $(".removePlaylist").click(function () {
            const id = this.id.split("playlist-remove-")[1];
            playlistManagerClass.removeById(id);
        });
    }

    function sortablePlaylist() {
        $("#checks").sortable();
    }

    function selectQuality() {
        $("#select-quality").change(function () {
            mediaManagerClass.setStreaming($(this).val());
        });
    }

    function changeVolume() {
        $("#volume").click(function () {
            mediaManagerClass.setVolume(($("#volume").val() / 100));
        })
    }

    function mediaEnd() {
        $("#audio").on("ended", function () {
            mediaManagerClass.endPlay();
        });
        $("#video").on("ended", function () {
            mediaManagerClass.endPlay();
        });
    }

    function timelineUpdate() {
        $("#video").bind('timeupdate', setTimeline);
        $("#audio").bind('timeupdate', setTimeline);
    }

    function setTimeline() {

        let time = 0;
        if (!$("#video")[0].paused) {
            if (mouseUp)
                $("#timeline-now").val(120000 / $("#video")[0].duration * $("#video")[0].currentTime);
            time = $("#video")[0].currentTime;
        }
        if (!$("#audio")[0].paused) {
            if (mouseUp)
                $("#timeline-now").val(120000 / $("#audio")[0].duration * $("#audio")[0].currentTime);
            time = $("#audio")[0].currentTime;
        }
        if (time > 0) {
            const minutes = (Math.floor(time / 60)).toLocaleString("pt-br", { minimumIntegerDigits: 2 });
            const seconds = (Math.floor(time - minutes * 60)).toLocaleString("pt-br", { minimumIntegerDigits: 2 });
            $("#time").html(minutes + ":" + seconds);
        }
    }

    function mouseTimeline() {
        $("#timeline-now").mousedown(function () {
            mouseUp = false;
        });
        $("#timeline-now").mouseup(function () {
            changeTime();
            mouseUp = true;
        });
    }

    function touchTimeline() {
        $("#timeline-now")[0].ontouchstart = function () {
            mouseUp = false;
        };
        $("#timeline-now")[0].ontouchend = function () {
            changeTime();
            console.log("thouch end: " + $("#timeline-now").val());
            mouseUp = true;
        };
    }

    function changeTime() {
        let seconds = 0;
        if (!$("#video")[0].paused) {
            seconds = $("#video")[0].duration / 120000 * $("#timeline-now").val();
            $("#video")[0].currentTime = seconds;
        }
        if (!$("#audio")[0].paused) {
            seconds = $("#audio")[0].duration / 120000 * $("#timeline-now").val();
            $("#audio")[0].currentTime = seconds;
        }
    }

    function btnNext() {
        $("#btn-next").click(function () {
            mediaManagerClass.endPlay();
        });
    }
    function btnPreview() {
        $("#btn-preview").click(function () {
            mediaManagerClass.previewPlay();
        });
    }

    function btnPlay() {
        $("#btn-play").click(function () {
            mediaManagerClass.actionPlay();
        });
    }

    function btnLoop() {
        $("#btn-loop").click(function () {
            if (mediaManagerClass.actionLoop())
                $("#btn-loop").removeClass("btn-outline-secondary").addClass("btn-success");
            else
                $("#btn-loop").removeClass("btn-success").addClass("btn-outline-secondary");

        });
    }

    function btnMute() {
        $("#volume-mute").click(function () {
            if (mediaManagerClass.actionMute())
                $("#volume-mute").removeClass("btn-outline-secondary").addClass("btn-danger");
            else
                $("#volume-mute").removeClass("btn-danger").addClass("btn-outline-secondary");
            mediaManagerClass.setVolume();
        });
    }

    function btnShuffle() {
        $("#btn-random").click(function () {
            mediaManagerClass.shuffle();
        });
    }

    function skippedPlay() {
        $(".skippedPlay").click(function () {
            const id = this.id.split("list-play-music-")[1];
            mediaManagerClass.skipped(id);
        });
    }

    function radioImport() {
        $(".radioImport").click(function () {
            $(".importOptionDisplay").addClass("d-none");
            $("#import-"+$(this).val()).removeClass("d-none");
        });

    }
    return {
        init,
        start,
        actionUrl,
        reload,
        btnsMusics,
        btnsPlaylists,
        btnsSeacrh,
        skippedPlay
    }
}