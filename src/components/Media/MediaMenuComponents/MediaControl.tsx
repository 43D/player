import { ChangeEvent, useEffect, useRef, useState } from "react";
import InterfaceMediaControl from "../../../type/InterfaceMediaControl";
import PagesType from "../../../type/PagesType";
import ConfigType from "../../../type/ConfigType";
import { KeyListenerPlayer } from "../../utils/KeyListenerPlayer";

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

    const changeVolumeByValue = (value: number) => {
        setVolumeValue(prev => {
            let volume = 0;
            const number = Number(prev);
            volume = number - value;
            if (volume < 0)
                volume = 0;
            else if (volume > 100)
                volume = 100;
            if (mutedBtn.current)
                mutedBtn.current.className = (String(volume) == "0")
                    ? 'mx-2 btn btn-danger text-light border rounded-circle'
                    : 'mx-2 btn btn-dark text-light border rounded-circle';

            control().setVolume(volume);

            return String(volume);
        });
    }

    const moreVolume = () => changeVolumeByValue(5);
    const lessVolume = () => changeVolumeByValue(-5);

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
        setLoopStatus(prev => {
            if (loopBtn.current)
                loopBtn.current.className = (!prev)
                    ? "w-100 btn btn-success text-light"
                    : "w-100 btn btn-dark text-light";
            pagesProps().loopQueue(!prev);
            return !prev;
        });
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

    const keyConfig = {
        "ArrowUp": lessVolume,
        "ArrowDown": moreVolume,
        "l": loopQueue,
        "m": changeMute,
    }

    for (let [key, action] of Object.entries(keyConfig))
        KeyListenerPlayer(key, action)

    return (
        <div className="col-12 col-md-5 my-1 col-lg-4 col-xl-3 d-flex justify-content-center align-items-center">
            <div className="d-flex justify-content-center -flex-warp">
                <button type="button" className="btn btn-outline-dark text-light dropdown-toggle border rounded-pill"
                    data-bs-toggle="dropdown" aria-expanded="false" id="btn-more" data-bs-auto-close="outside" >
                    <i className="bi bi-three-dots" />
                </button>
                <ul className="dropdown-menu dropdown-menu-start" id="menu-more" style={{ minWidth: "200px" }}>
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
    );
}


export default MediaControl