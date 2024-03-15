import PagesType from "../type/PagesType";

type dependencias = {
    pageProps: () => PagesType;
}

export const KeyPressAction = ({ pageProps }: dependencias) => {

    const checkInputText = () => {
        return !(document.activeElement instanceof HTMLInputElement);
    }

    const play = () => {
        console.log("play");
        if (checkInputText()) { }
    }

    const volumeMore = () => {
        console.log("volume+");
        if (checkInputText()) { }
    }

    const volumeLess = () => {
        console.log("volume-");
        if (checkInputText()) { }
    }

    const fullScreenVideo = () => {
        console.log("fullScreenVideo");
        if (checkInputText()) { }
    }

    const nextSong = () => {
        console.log("nextSong");
        if (checkInputText())
            pageProps().nextQueue();
    }

    const prevSong = () => {
        console.log("prevSong");
        if (checkInputText())
            pageProps().previousQueue();
    }

    const LoopQueue = () => {
        console.log("LoopQueue");
        if (checkInputText()) { }
    }

    const muted = () => {
        console.log("muted");
        if (checkInputText()) { }
    }

    const shuffle = () => {
        console.log("shuffle");
        if (checkInputText())
            pageProps().shuffleQueue();
    }

    const showQueue = () => {
        console.log("showQueue");
        if (checkInputText())
            pageProps().openQueue();
    }

    const getLink = () => {
        console.log("getLink");
        if (checkInputText())
            pageProps().getLink();
    }

    const showQualityBtn = () => {
        console.log("showQualityBtn");
        if (checkInputText()) { }
    }

    const setQualityAudio = () => {
        console.log("setQualityAudio");
        if (checkInputText()) { }
    }

    const setQualityVideo480 = () => {
        console.log("setQualityVideo480");
        if (checkInputText()) { }
    }

    const setQualityVideo720 = () => {
        console.log("setQualityVideo720");
        if (checkInputText()) { }
    }

    const showVideo = () => {
        console.log("showVideo");
        if (checkInputText())
            pageProps().showVideo();
    }

    const openAnime = () => {
        console.log("openAnime");
        if (checkInputText()) { }
    }

    const openArtist = () => {
        console.log("openArtist");
        if (checkInputText()) { }
    }

    const skipFiveSecond = () => {
        console.log("skipFiveSecond");
        if (checkInputText()) { }
    }

    const prevFiveSecond = () => {
        console.log("prevFiveSecond");
        if (checkInputText()) { }
    }

    return {
        play,
        volumeMore,
        volumeLess,
        fullScreenVideo,
        nextSong,
        prevSong,
        LoopQueue,
        muted,
        shuffle,
        showQueue,
        getLink,
        showQualityBtn,
        setQualityAudio,
        setQualityVideo480,
        setQualityVideo720,
        showVideo,
        openAnime,
        openArtist,
        skipFiveSecond,
        prevFiveSecond
    }
}



