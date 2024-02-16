import { ChangeEvent } from "react";
import PagesType from "../../../type/PagesType";
import ConfigType from "../../../type/ConfigType";

type queueType = {
    pagesProps: () => PagesType;
    store: {
        getConfig: () => ConfigType;
        setConfig: (data: ConfigType) => void;
    };
}


function MediaQueue({ pagesProps, store }: queueType) {

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

    const showVideo = () => {
        pagesProps().showVideo();
    }

    return (
        <div className="col-12 col-lg-3 col-xl-2 d-flex justify-content-center align-items-center">
            <button className="btn btn-outline-dark text-light dropdown-toggle border rounded-pill"
                data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside">
                <i className="bi bi-badge-hd"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-start" id="menu-more" style={{ minWidth: "200px" }}>
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
            <button className="btn btn-outline-dark text-light mx-1 border rounded-circle" onClick={showVideo}><i className="bi bi-film"></i></button>
            <button id="btn-list-collapse" onClick={pagesProps().openQueue} className="btn btn-outline-dark rounded-pill text-light w-100">Queue</button>
        </div>
    );
}


export default MediaQueue