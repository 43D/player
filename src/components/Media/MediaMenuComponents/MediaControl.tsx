import { ChangeEvent, useEffect, useRef, useState } from "react";
import InterfaceMediaControl from "../../../type/InterfaceMediaControl";
import PagesType from "../../../type/PagesType";
import ConfigType from "../../../type/ConfigType";

type menuType = {
    pagesProps: () => PagesType;
    control: () => InterfaceMediaControl;
    store: {
        getConfig: () => ConfigType;
        setConfig: (data: ConfigType) => void;
    };
}

function MediaControl({ pagesProps, control, store }: menuType) {
    const config = store.getConfig();

    const playBtn = useRef<HTMLElement | null>(null);

    const mutedBtn = useRef<HTMLButtonElement | null>(null);

    const volumeBar = useRef<HTMLInputElement | null>(null);
    const [volumeValue, setVolumeValue] = useState<string>((config.volume * 100) + "");
    const [volumeBackup, setvolumeBackup] = useState<string>((config.volume * 100) + "");

    const loopBtn = useRef<HTMLButtonElement | null>(null);
    const [loopStatus, setLoopStatus] = useState<boolean>(config.loop);

    useEffect(() => {
        if (mutedBtn.current)
            mutedBtn.current.className = (volumeValue == "0")
                ? 'mx-2 btn btn-danger text-light border rounded-circle'
                : 'mx-2 btn btn-dark text-light border rounded-circle';
        if (loopBtn.current)
            loopBtn.current.className = (loopStatus)
                ? "w-100 btn btn-success text-light"
                : "w-100 btn btn-dark text-light";
    }, []);

    useEffect(() => {
        const intervalId = setInterval(checkBtnPlay, 500);

        return () => clearInterval(intervalId);
    }, []);

    const setVolume = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setVolumeValue(value);
        if (mutedBtn.current)
            mutedBtn.current.className = (value == "0")
                ? 'mx-2 btn btn-danger text-light border rounded-circle'
                : 'mx-2 btn btn-dark text-light border rounded-circle';

        control().setVolume(Number(value));
    }

    const changeMute = () => {
        if (volumeBar.current) {
            const value = volumeBar.current?.value;

            setvolumeBackup(volumeValue);
            const newVolume = (value != "0") ? "0" : volumeBackup;

            setVolumeValue(newVolume);
            if (mutedBtn.current)
                mutedBtn.current.className = (newVolume == "0")
                    ? 'mx-2 btn btn-danger text-light border rounded-circle'
                    : 'mx-2 btn btn-dark text-light border rounded-circle';

            control().setVolume(Number(newVolume));
        }
    }

    const loopQueue = () => {
        let status = true;
        if (loopStatus)
            status = false;

        if (loopBtn.current)
            loopBtn.current.className = (status)
                ? "w-100 btn btn-success text-light"
                : "w-100 btn btn-dark text-light";

        pagesProps().loopQueue(status);
        setLoopStatus(status);
    }

    const showVideo = () => {
        pagesProps().showVideo();
    }

    const ShuffleQueue = () => {
        pagesProps().shuffleQueue();
    }

    const getLink = () => {
        pagesProps().getLink();
    }

    const onChangePlay = () => {
        const config = store.getConfig();
        if (playBtn.current)
            playBtn.current.className = config.played ? 'bi bi-pause' : 'bi bi-play';

        control().play(!config.played);
        config.played = !config.played;
        store.setConfig(config);
    }

    const checkBtnPlay = () => {
        const config = store.getConfig();
        if (playBtn.current)
            playBtn.current.className = config.played ? 'bi bi-pause' : 'bi bi-play';
    }

    const qualityStreaming = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const json = store.getConfig();
        json.streaming = value;
        store.setConfig(json);
    }
    const checkQualityStreaming = (quality: string) => {
        const json = store.getConfig();
        return (json.streaming == quality) ? true : false;
    }

    const serverOptions = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const json = store.getConfig();
        json.server = value;
        store.setConfig(json);
    }
    const checkServerOptions = (quality: string) => {
        const json = store.getConfig();
        return (json.server == quality) ? true : false;
    }

    return (
        <div className="col-12 col-md-6  my-1 col-lg-5 col-xl-4">
            <div className="d-flex justify-content-center">
                <div className="d-flex justify-content-center -flex-warp">
                    <button type="button" className="btn btn-outline-dark text-light dropdown-toggle border rounded-pill"
                        data-bs-toggle="dropdown" aria-expanded="false" id="btn-more" data-bs-auto-close="outside" >
                        <i className="bi bi-three-dots" />
                    </button>
                    <ul className="dropdown-menu dropdown-menu-start" id="menu-more" style={{ minWidth: "200px" }}>
                        <li>
                            <button id="btn-video-collapse" onClick={showVideo} type="button" className="btn btn-dark w-100 text-light">
                                <i className="bi bi-film" /> Show video
                            </button>
                        </li>
                        <li>
                            <button type="button" id="btn-random" onClick={ShuffleQueue} className="w-100 btn btn-dark text-light">
                                <i className="bi bi-shuffle" /> Shuffle queue
                            </button>
                        </li>
                        <li>
                            <button type="button" id="btn-loop" ref={loopBtn} onClick={loopQueue} className="w-100 btn btn-dark text-light">
                                <i className="bi bi-arrow-clockwise" /> Loop queue
                            </button>
                        </li>
                        <li>
                            <button type="button" id="btn-link" onClick={getLink} className="w-100 btn btn-dark text-light">
                                <i className="bi bi-link-45deg" /> Get link
                            </button>
                        </li>
                        <li>
                            <button type="button" id="btn-quality-media" className="w-100 btn btn-dark text-light dropdown-toggle"
                                data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#menu-quality-media" aria-controls="menu-quality-media">
                                <i className="bi bi-badge-hd" /> Streaming quality
                            </button>
                        </li>
                        <li className="collapse px-4 mb-3 mt-1" id="menu-quality-media">
                            <div className=" d-flex flex-column">
                                <input className="btn-check" onChange={qualityStreaming} value="0" type="radio" name="radio-streming-quality-option" id="radio-streming-quality-option1" defaultChecked={checkQualityStreaming("0")} />
                                <label className="btn btn-outline-success" htmlFor="radio-streming-quality-option1">
                                    <i className="bi bi-music-note" /> Audio only
                                </label>
                                <input className="btn-check" onChange={qualityStreaming} value="480" type="radio" name="radio-streming-quality-option" id="radio-streming-quality-option2" defaultChecked={checkQualityStreaming("480")} />
                                <label className="btn btn-outline-success" htmlFor="radio-streming-quality-option2">
                                    <i className="bi bi-badge-sd" /> 480p
                                </label>
                                <input className="btn-check" onChange={qualityStreaming} value="720" type="radio" name="radio-streming-quality-option" id="radio-streming-quality-option3" defaultChecked={checkQualityStreaming("720")} />
                                <label className="btn btn-outline-success" htmlFor="radio-streming-quality-option3">
                                    <i className="bi bi-badge-hd" /> 720p
                                </label>
                            </div>
                            <div>
                                <p className="mb-0 mt-2 text-center"> <i className="bi bi-info"></i> Change effective <br />
                                from the next song</p>
                            </div>
                        </li>
                        <li>
                            <button type="button" id="btn-server" className="w-100 btn btn-dark text-light dropdown-toggle"
                                data-bs-toggle="collapse" aria-expanded="false" data-bs-target="#menu-server" aria-controls="menu-server">
                                <i className="bi bi-hdd-network" /> Host server
                            </button>
                        </li>
                        <li className="collapse px-4 mb-1 mt-1" id="menu-server">
                            <div className=" d-flex flex-column">
                                <input className="btn-check" type="radio" name="radio-server-option" id="radio-server-option1" value="EU1" onChange={serverOptions} defaultChecked={checkServerOptions("EU1")} />
                                <label className="btn btn-outline-success" htmlFor="radio-server-option1">
                                    Europe
                                </label>
                                <input className="btn-check" type="radio" name="radio-server-option" id="radio-server-option2" value="NA1" onChange={serverOptions} defaultChecked={checkServerOptions("NA1")} />
                                <label className="btn btn-outline-success" htmlFor="radio-server-option2">
                                    American 1
                                </label>
                                <input className="btn-check" type="radio" name="radio-server-option" id="radio-server-option3" value="NA2" onChange={serverOptions} defaultChecked={checkServerOptions("NA2")} />
                                <label className="btn btn-outline-success" htmlFor="radio-server-option3">
                                    American 2
                                </label>
                                <input className="btn-check" type="radio" name="radio-server-option" id="radio-server-option4" value="CAT" onChange={serverOptions} defaultChecked={checkServerOptions("CAT")} />
                                <label className="btn btn-outline-success" htmlFor="radio-server-option4">
                                    Catbox Moe
                                </label>
                            </div>
                            <div>
                                <p className="mb-0 mt-2 text-center"> <i className="bi bi-info"></i> Change effective <br />
                                from the next song</p>
                            </div>
                        </li>
                    </ul>

                    <button type="button" onClick={pagesProps().previousQueue} id="btn-preview" className="mx-1 btn btn-outline-dark text-light border rounded-circle">
                        <i className="bi bi-arrow-left" />
                    </button>

                    <button type="button" id="btn-play" onClick={onChangePlay} className="btn mx-1 btn-outline-dark text-light border rounded-pill">
                        <i ref={playBtn} className="bi bi-play" />
                    </button>

                    <button type="button" onClick={pagesProps().nextQueue} id="btn-next" className="btn mx-1  btn-outline-dark text-light border rounded-circle">
                        <i className="bi bi-arrow-right" />
                    </button>
                    <button type="button" className="btn btn-outline-dark text-light dropdown-toggle border rounded-pill"
                        data-bs-toggle="dropdown" aria-expanded="false" id="btn-volume" data-bs-auto-close="outside">
                        <i className="bi bi-volume-up" />
                    </button>
                    <div className="dropdown-menu dropdown-menu-end" id="menu-volume">
                        <div className="d-flex align-items-center">
                            <button id="volume-mute" type="button" onClick={changeMute} ref={mutedBtn}
                                className="mx-2 btn btn-dark text-light border rounded-circle">
                                <span id="play">
                                    <i className="bi bi-volume-mute" />
                                </span>
                            </button>
                            <input type="range" ref={volumeBar} onChange={setVolume} min="0" max="100" value={volumeValue} className="ui-slider mx-2 " id="volume" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default MediaControl