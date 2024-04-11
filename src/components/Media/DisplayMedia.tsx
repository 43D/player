import { useEffect, useRef, useState } from "react";
import InterfaceMediaControl from "../../type/InterfaceMediaControl";
import ConfigType from "../../type/ConfigType";
import InterfaceMediaTimeline from "../../type/InterfaceMediaTimeline";
import DBType from "../../type/DBType";
import JsonSong from "../../type/Songs";
import InterfaceMediaQueue from "../../type/InterfaceMediaQueue";
import { feacthAnimeInfo } from "../../services/feacthAnimeInfo";

interface MediaProps {
    store: {
        getConfig: () => ConfigType;
        setConfig: (data: ConfigType) => void;
        getQueue: () => string[];
        setQueue: (data: string[]) => void;
    };
    timelineProp: () => InterfaceMediaTimeline;
    dbProp: DBType;
    control: (control: InterfaceMediaControl) => void;
    queueControllProp: () => InterfaceMediaQueue;
}

const DisplayMedia: React.FC<MediaProps> = ({ store, queueControllProp, timelineProp, control, dbProp }) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    let servers = ["NA1", "NA2", "EU1", "CAT"];
    let serverAtual = store.getConfig().server;

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
                playAnotherInTheQueue: (index: number) => playAnotherInTheQueue(index),
                removeFromQueue: (songId: number) => removeFromQueue(songId),
            });
        }
    }, [control]);

    useEffect(() => {
        const intervalId = setInterval(showCurrentTime, 1000); // Atualiza a cada segundo

        return () => clearInterval(intervalId); // Limpa o intervalo ao desmontar o componente
    }, []);

    const pauseAll = () => {
        videoRef.current?.pause();
        audioRef.current?.pause();
    }

    const getUrlParse = (url: string) => {
        const src = url.split("/");
        const inter = src[src.length - 1].length;
        if (inter > 0)
            return src[src.length - 1]
        return src[src.length - 2]
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

        metadado(song);
        return parse;
    }

    const setAndPlay = async (json: ConfigType) => {
        const song = await getMedia(json);
        servers = ["NA1", "NA2", "EU1", "CAT"];
        if (song.streaming == "audio")
            if (audioRef.current) {
                if (getUrlParse(audioRef.current?.src) != getUrlParse(song.media))
                    setAudioSrc(song.media);
                pauseAll();
                audioRef.current.play();
                if (videoRef.current && videoRef.current?.src)
                    setVideoSrc("0");
            }

        if (song.streaming == "video")
            if (videoRef.current) {
                if (getUrlParse(videoRef.current.src) != getUrlParse(song.media))
                    setVideoSrc(song.media);
                pauseAll();
                videoRef.current.play();
                if (audioRef.current && audioRef.current?.src != "")
                    setAudioSrc("0");
            }

        changeVolume(json.volume * 100);
    }

    const setAudioSrc = (url: string) => {
        if (audioRef.current) {
            if (url == "0") {
                audioRef.current.src = "0";
                audioRef.current.removeAttribute("src");
            } else {
                const link = getCurrretServerUrl(url);
                audioRef.current.src = link;
                const json = store.getConfig();
                json.current_link = link;
                store.setConfig(json);
            }
        }
    }

    const setVideoSrc = (url: string) => {
        if (videoRef.current) {
            if (url == "0") {
                videoRef.current.src = "0";
                videoRef.current.removeAttribute("src");
            }
            else {
                const link = getCurrretServerUrl(url);
                videoRef.current.src = link;
                const json = store.getConfig();
                json.current_link = link;
                store.setConfig(json);
            }
        }
    }

    const getCurrretServer = () => {
        const json = store.getConfig();
        return json.server;
    }


    const getCurrretServerUrl = (url: string, server: string = getCurrretServer()) => {
        let base = "";
        const sub = getUrlParse(url);
        if (server == "NA1")
            base = "https://ladist1.catbox.video/";
        else if (server == "NA2")
            base = "https://vhdist1.catbox.video/";
        else if (server == "EU1")
            base = "https://nl.catbox.video/";
        else
            base = "https://files.catbox.moe/";

        serverAtual = server;
        return base + sub;
    }

    const setAlternativeServerVideo = () => {
        servers = servers.filter(item => item !== serverAtual);
        serverAtual = servers[0];

        if (servers.length > 0) {
            if (videoRef.current) {
                const link = getCurrretServerUrl(videoRef.current.src, servers[0]);
                videoRef.current.src = link;
                const json = store.getConfig();
                json.current_link = link;
                store.setConfig(json);
            }
        } else {
            nextSong();
        }
    }

    const setAlternativeServerAudio = () => {
        servers = servers.filter(item => item !== serverAtual);
        serverAtual = servers[0];

        if (servers.length > 0) {
            if (audioRef.current) {
                const link = getCurrretServerUrl(audioRef.current.src, servers[0]);
                audioRef.current.src = link;
                const json = store.getConfig();
                json.current_link = link;
                store.setConfig(json);
            }
        } else {
            nextSong();
        }
    }


    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.addEventListener('error', setAlternativeServerVideo);

        return () => {
            video.removeEventListener('error', setAlternativeServerVideo);
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.addEventListener('error', setAlternativeServerAudio);

        return () => {
            audio.removeEventListener('error', setAlternativeServerAudio);
        };
    }, []);




    const playMedia = (played: boolean) => {
        const json = store.getConfig();
        json.playNowId = store.getQueue()[json.playIndex];
        if (json.playNowId == "0" || json.playNowId == undefined) {
            timelineProp().setId("0");
            pauseAll();
            return;
        }

        if (played)
            setAndPlay(json);
        else
            pauseAll();

        json["played"] = played;
        store.setConfig(json);
        timelineProp().setId(json.playNowId);
        dbProp.addListen(Number(json.playNowId));
        queueControllProp().updateQueue();
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
            if (!json.loop) {
                json.played = false;
                store.setConfig(json);
                return;
            }
        }

        json.playNowId = queue[json.playIndex];
        store.setConfig(json);
        playMedia(true);
        queueControllProp().updateQueue();
    }

    const showCurrentTime = () => {
        if (audioRef.current)
            if (audioRef.current.src != "")
                timelineProp().setTimeline(120000 / audioRef.current.duration * audioRef.current.currentTime, audioRef.current.duration);
        if (videoRef.current)
            if (videoRef.current.src != "")
                timelineProp().setTimeline(120000 / videoRef.current.duration * videoRef.current.currentTime, videoRef.current.duration);
    }


    const changeTime = (value: string) => {
        if (audioRef.current)
            if (audioRef.current.src != "")
                audioRef.current.currentTime = (Number(value) * audioRef.current.duration / 120000);
        if (videoRef.current)
            if (videoRef.current.src != "")
                videoRef.current.currentTime = (Number(value) * videoRef.current.duration / 120000);

    }

    const showVideo = () => {
        setComponentStyle((prevStyle) => {
            const newDisplay = prevStyle.display === "none" ? "block" : "none";
            return { ...prevStyle, display: newDisplay };
        });
    }

    const metadado = async (json: JsonSong) => {
        if ('mediaSession' in navigator) {
            const artist = (json.songArtist) ? json.songArtist.toString() : "????";
            const ann = await feacthAnimeInfo().fetchAnimeInfoAnn(String(json.annId));
            let image = getImage(ann as Document);
            if (image == "") image = "https://43d.github.io/player/logo.png";

            navigator.mediaSession.metadata = new MediaMetadata({
                title: json.songName,
                artist: artist,
                album: json.animeENName,
                artwork: [
                    { src: image, sizes: '512x512', type: 'image/png' },
                ],
            });
        }
    }

    const getImage = (animeAnn: Document) => {
        if (animeAnn) {
            const pictureNodes = animeAnn.querySelectorAll('anime > info[type="Picture"] > img');
            let maxResolution = 0;
            let maxResolutionImgSrc = '';
            pictureNodes.forEach((node) => {
                const width = parseInt(node.getAttribute('width') as string);
                const height = parseInt(node.getAttribute('height') as string);
                const resolution = width * height;
                if (resolution > maxResolution) {
                    maxResolution = resolution;
                    maxResolutionImgSrc = node.getAttribute('src') as string;
                }
            });
            return maxResolutionImgSrc;
        }
        return "";
    }

    const playAnotherInTheQueue = (playIndex: number) => {
        const json = store.getConfig();
        const queue = store.getQueue();
        json.playIndex = playIndex;
        json.playNowId = queue[json.playIndex];
        store.setConfig(json);
        playMedia(true);
        queueControllProp().updateQueue();
    }

    const removeFromQueue = (songId: number) => {
        const json = store.getConfig();
        const queue = store.getQueue();
        const indexRemoval = queue.indexOf(String(songId));
        const indexPlayActual = queue.indexOf(json.playNowId);
        const newQueue = queue.filter(item => item !== String(songId));

        if (newQueue.length == 0) {
            json.playIndex = 0;
            json.playNowId = "0";
            store.setQueue(newQueue);
            store.setConfig(json);
            playMedia(true);
            queueControllProp().updateQueue();
            return;
        }

        if (indexRemoval == -1) return;
        if (indexPlayActual >= indexRemoval) json.playIndex -= 1;
        if (json.playIndex < 0) json.playIndex = 0;

        json.playNowId = newQueue[json.playIndex];

        console.log(newQueue, json);


        store.setQueue(newQueue);
        store.setConfig(json);
        playMedia(true);

        queueControllProp().updateQueue();
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