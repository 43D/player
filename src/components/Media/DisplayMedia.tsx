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
    const [config, setConfig] = useState<ConfigType>(store.getConfig());
    const [isPlayed, setIiPlayed] = useState<boolean>(false);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (videoRef.current) {
            control({
                play: (played: boolean) => playMedia(played),
                setVolume: (volume: number) => changeVolume(volume),
                changeTimeline: (value: string) => changeTime(value),
            });
        }
    }, [control]);

    const pauseAll = () => {
        videoRef.current?.pause();
        audioRef.current?.pause();
    }

    const setAndPlay = async (json: ConfigType) => {
        const song = await dbProp.getSongById(Number(json.playNowId));
        if (json.streaming == "0") {
            if (audioRef.current) {
                audioRef.current.src = song.audio;
                audioRef.current.play();
            }
        } else if (json.streaming == "480") {
            if (videoRef.current) {
                videoRef.current.src = song.MQ;
                videoRef.current.play();
            }
        } else {
            if (videoRef.current) {
                videoRef.current.src = song.HQ;
                videoRef.current.play();
            }
        }
        changeVolume(json.volume * 100);
        setIiPlayed(true);
    }

    const play = async (json: ConfigType) => {
        if (json.streaming == "0") {
            if (audioRef.current) {
                audioRef.current.play();
            }
        } else if (json.streaming == "480") {
            if (videoRef.current) {
                videoRef.current.play();
            }
        } else {
            if (videoRef.current) {
                videoRef.current.play();
            }
        }
        changeVolume(json.volume * 100);
    }

    const playMedia = (played: boolean) => {
        const json = store.getConfig();
        json.playNowId = store.getQueue()[json.playIndex];
        if (json.playNowId == "0")
            return;


        if (played) {
            if (json.playNowId == config.playNowId && isPlayed)
                play(json)
            else
                setAndPlay(json);

        } else
            pauseAll();
        setConfig(json);
        store.setConfig(json);
    }

    const changeVolume = (volume: number) => {
        const json = store.getConfig();
        json.volume = volume / 100;
        store.setConfig(json);
        setConfig(json);
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
        if (audioRef.current)
            timelineProp().setTimeline(120000 / audioRef.current.duration * audioRef.current.currentTime);
    };


    const changeTime = (value: string) => {
        if (audioRef.current)
            audioRef.current.currentTime = (Number(value) * audioRef.current.duration / 120000);
    }


    useEffect(() => {
        const intervalId = setInterval(showCurrentTime, 1000); // Atualiza a cada segundo

        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, []);

    return (
        <div id="display-media" className="container-fluid displays p-0 m-0 d-flex align-items: center d-none">
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