import { useEffect, useRef, useState } from "react";
import InterfaceMediaControl from "../../type/InterfaceMediaControl";
import ConfigType from "../../type/ConfigType";
import InterfaceMediaTimeline from "../../type/InterfaceMediaTimeline";
import DBType from "../../type/DBType";

interface MediaProps {
    store: {
        getConfig: () => ConfigType;
        setConfig: (data: ConfigType) => void;
        getQueue: () => string[];
    };
    timelineProp: () => InterfaceMediaTimeline;
    dbProp: DBType;
}

const DisplayMedia: React.FC<MediaProps & { control: (control: InterfaceMediaControl) => void }> = ({ store, timelineProp, control, dbProp }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [componentStyle, setComponentStyle] = useState<React.CSSProperties>({
        top: "64px",
        backgroundColor: "#212529",
        display: "none",
        position: "fixed",
        zIndex: "43"
    });


    useEffect(() => {
        if (videoRef.current) {
            control({
                play: (played: boolean) => playMedia(played),
                setVolume: (volume: number) => changeVolume(volume),
                changeTimeline: (value: string) => changeTime(value),
                showMedia: () => showVideo(),
            });
        }
    }, [control]);

    const pauseAll = () => {
        videoRef.current?.pause();
        audioRef.current?.pause();
    }

    const getMedia = async (json: ConfigType) => {
        const song = await dbProp.getSongById(Number(json.playNowId));
        const parse = {
            media: "",
            streaming: "audio"
        }

        if (song.audio) {
            parse.media = song.audio;
        } else if (song.MQ) {
            parse.media = song.MQ;
            parse.streaming = "video";
        } else if (song.HQ) {
            parse.media = song.HQ;
            parse.streaming = "video";
        }

        if (json.streaming == "720") {
            if (song.HQ) {
                parse.media = song.HQ;
                parse.streaming = "video";
            } else if (song.MQ) {
                parse.media = song.MQ;
                parse.streaming = "video";
            }
        } else if ((json.streaming == "480")) {
            if (song.MQ) {
                parse.media = song.MQ;
                parse.streaming = "video";
            }
        }
        return parse;
    }

    const setAndPlay = async (json: ConfigType) => {
        const song = await getMedia(json);
        if (song.streaming == "audio")
            if (audioRef.current) {
                if (audioRef.current?.src != song.media)
                    audioRef.current.src = song.media;
                pauseAll();
                audioRef.current.play();
                if (videoRef.current && videoRef.current?.src != "")
                    videoRef.current.src = ""
            }

        if (song.streaming == "video")
            if (videoRef.current) {
                if (videoRef.current.src != song.media)
                    videoRef.current.src = song.media;
                pauseAll();
                videoRef.current.play();
            }

        changeVolume(json.volume * 100);
    }

    const playMedia = (played: boolean) => {
        const json = store.getConfig();
        json.playNowId = store.getQueue()[json.playIndex];
        if (json.playNowId == "0")
            return;

        if (played)
            setAndPlay(json);
        else
            pauseAll();

        store.setConfig(json);
        timelineProp().setId(json.playNowId);
        dbProp.addListen(Number(json.playNowId));
    }

    const changeVolume = (volume: number) => {
        const json = store.getConfig();
        json.volume = volume / 100;
        store.setConfig(json);
        if (videoRef.current) {
            videoRef.current.volume = json.volume;
            videoRef.current.muted = false;
        }
        if (audioRef.current) {
            audioRef.current.volume = json.volume;
            audioRef.current.muted = false;
        }

    }

    const nextSong = () => {
        const json = store.getConfig();

        const queue = store.getQueue();
        json.playIndex += 1;
        if (queue.length == json.playIndex) {
            json.playIndex = 0;
            if (!json.loop)
                return;
        }

        json.playNowId = queue[json.playIndex];
        store.setConfig(json);
        playMedia(true);
    }

    const showCurrentTime = () => {
        if (store.getConfig().streaming == "0") {
            if (audioRef.current)
                timelineProp().setTimeline(120000 / audioRef.current.duration * audioRef.current.currentTime, audioRef.current.duration);
        } else {
            if (videoRef.current)
                timelineProp().setTimeline(120000 / videoRef.current.duration * videoRef.current.currentTime, videoRef.current.duration);
        }
    };


    const changeTime = (value: string) => {
        if (store.getConfig().streaming == "0") {

            if (audioRef.current)
                audioRef.current.currentTime = (Number(value) * audioRef.current.duration / 120000);
        } else {
            if (videoRef.current)
                videoRef.current.currentTime = (Number(value) * videoRef.current.duration / 120000);
        }
    }


    useEffect(() => {
        const intervalId = setInterval(showCurrentTime, 1000); // Atualiza a cada segundo

        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, []);

    const showVideo = () => {
        setComponentStyle((prevStyle) => {
            const newDisplay = prevStyle.display === "none" ? "block" : "none";
            return { ...prevStyle, display: newDisplay };
        });
    }

    return (
        <div id="display-media" style={componentStyle} className=" fixed-top container-fluid displays p-0 m-0">
            <div className="row h-100 w-100  p-0 m-0">
                <div className="col-12 h-100 p-0 m-0">
                    <div className="h-100 d-flex justify-content-center flex-column">
                        <video ref={videoRef} id="video" onEnded={nextSong}></video>
                    </div>
                    <div className="col d-none">
                        <audio ref={audioRef} id="audio" onEnded={nextSong}></audio>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default DisplayMedia