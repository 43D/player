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

    const play = () => {
        console.log("play");
        const config = store.getConfig();
        control().play(!config.played);
        config.played = !config.played;
        store.setConfig(config);
    }

    const volumeMore = () => {
        console.log("volume+");
    }

    const volumeLess = () => {
        console.log("volume-");
    }

    const fullScreenVideo = () => {
        console.log("fullScreenVideo");

    }

    const nextSong = () => {
        console.log("nextSong");
        pageProps().nextQueue();
    }

    const prevSong = () => {
        console.log("prevSong");
        pageProps().previousQueue();
    }

    const LoopQueue = () => {
        console.log("LoopQueue");

    }

    const muted = () => {
        console.log("muted");

    }

    const shuffle = () => {
        console.log("shuffle");
        pageProps().shuffleQueue();
    }

    const getLink = () => {
        console.log("getLink");
        pageProps().getLink();
    }

    const showQualityBtn = () => {
        console.log("showQualityBtn");

    }

    const setQualityAudio = () => {
        console.log("setQualityAudio");

    }

    const setQualityVideo480 = () => {
        console.log("setQualityVideo480");

    }

    const setQualityVideo720 = () => {
        console.log("setQualityVideo720");

    }

    const showVideo = () => {
        console.log("showVideo");
        pageProps().showVideo();
    }

    const openAnime = () => {
        console.log("openAnime");

    }

    const openArtist = () => {
        console.log("openArtist");

    }

    const skipFiveSecond = () => {
        console.log("skipFiveSecond");

    }

    const prevFiveSecond = () => {
        console.log("prevFiveSecond");

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



