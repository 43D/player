import ConfigType from "../type/ConfigType";
import InterfaceMediaControl from "../type/InterfaceMediaControl";
import PagesType from "../type/PagesType";

type dependencias = {
    store: {
        getConfig: () => ConfigType;
        setConfig: (data: ConfigType) => void;
    };
    control: () => InterfaceMediaControl;
    pageProps: () => PagesType;
}

export type KeyPressActionType = {
    play: () => void;
    volumeMore: () => void;
    volumeLess: () => void;
    fullScreenVideo: () => void;
    nextSong: () => void;
    prevSong: () => void;
    LoopQueue: () => void;
    muted: () => void;
    shuffle: () => void;
    showQueue: () => void;
    getLink: () => void;
    showQualityBtn: () => void;
    setQualityAudio: () => void;
    setQualityVideo480: () => void;
    setQualityVideo720: () => void;
    showVideo: () => void;
    openAnime: () => void;
    openArtist: () => void;
    skipFiveSecond: () => void;
    prevFiveSecond: () => void;
}

export const KeyPressAction = ({ store, control, pageProps }: dependencias) => {
    console.log("fullScreenVideo");
    console.log("showQueue");
    console.log("prevFiveSecond");
    console.log("skipFiveSecond");
    console.log("setQualityVideo720");
    console.log("setQualityVideo480");
    console.log("setQualityAudio");
    console.log("showQualityBtn");

    const checkInputText = () => {
        return !(document.activeElement instanceof HTMLInputElement);
    }

    const play = () => {
        console.log("play");
        if (checkInputText()) {
            const config = store.getConfig();
            control().play(!config.played);
            config.played = !config.played;
            store.setConfig(config);
        }
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
        // showQueue,
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



