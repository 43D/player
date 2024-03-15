import PagesType from "../type/PagesType";

type dependencias = {
    pageProps: () => PagesType;
}

export const KeyPressAction = ({ pageProps }: dependencias) => {
    const play = () => {
        console.log("play")
    }

    const volumeMore = () => {
        console.log("volume+")
    }

    const volumeLess = () => {
        console.log("volume-")
    }

    const fullScreenVideo = () => {
        console.log("fullScreenVideo")
    }

    const nextSong = () => {
        console.log("nextSong");
        pageProps().nextQueue();
    }

    const prevSong = () => {
        console.log("prevSong")
        pageProps().previousQueue();
    }

    const LoopQueue = () => {
        console.log("LoopQueue")
    }

    const muted = () => {
        console.log("muted")
    }

    const shuffle = () => {
        pageProps().shuffleQueue();
        console.log("shuffle")
    }

    const showQueue = () => {
        pageProps().openQueue();
        console.log("showQueue")
    }

    const getLink = () => {
        pageProps().getLink();
        console.log("getLink")
    }

    const showQualityBtn = () => {
        console.log("showQualityBtn")
    }

    const setQualityAudio = () => {
        console.log("setQualityAudio")
    }

    const setQualityVideo480 = () => {
        console.log("setQualityVideo480")
    }

    const setQualityVideo720 = () => {
        console.log("setQualityVideo720")
    }

    const showVideo = () => {
        pageProps().showVideo();
        console.log("showVideo")
    }

    const openAnime = () => {
        console.log("openAnime")
    }

    const openArtist = () => {
        console.log("openArtist")
    }

    const skipFiveSecond = () => {
        console.log("skipFiveSecond")
    }

    const prevFiveSecond = () => {
        console.log("prevFiveSecond")
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



