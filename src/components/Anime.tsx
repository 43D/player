import { useIndexedDB } from "react-indexed-db-hook";
import PagesType from "../type/PagesType";
import { useEffect, useState } from "react";
import MessageCom from "./MessageCom";
import { feacthAniSong } from "../services/feacthAniSong";
import AnimeAll from "./Anime/AnimeAll";
import AnimeType from "./Anime/AnimeType";
import { database } from "../db/database";

type idType = {
    id: number;
    pageProps: PagesType;
}

function Anime({ id, pageProps }: idType) {
    const { add, update } = useIndexedDB("songs");
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [name, setName] = useState<String>("");
    const [nameJP, setNameJP] = useState<String>("");
    const [componentSong, setComponentSong] = useState<JSX.Element[]>([]);
    const [componentType, setComponentType] = useState<JSX.Element[]>([]);


    useEffect(() => {
        setComponent([<MessageCom key={"43"} msg="Pesquisando músicas, aguarde...." />])
        searchAllSong();
    }, [id]);

    async function searchAllSong() {
        const result = await feacthAniSong().fetchSongById(id);
        setName(result[0].animeENName);
        setNameJP(result[0].animeJPName + " - " + result[0].animeVintage + " (" + result[0].animeType + ")");
        const compSong = <AnimeAll key={"13"} songList={result} pageProps={pageProps} />
        setComponentSong([compSong]);
        const compType = <AnimeType key={"14"} songList={result} pageProps={pageProps} />
        setComponentType([compType]);
        setComponent([compSong]);
        database(add, update).saveSongList(result);
    };

    const switchBtn = (id: string) => {
        const elements = document.querySelectorAll('.anime-filter');
        elements.forEach(element => {
            if (element.classList.contains('btn-success'))
                element.classList.remove('btn-success');
            if (!element.classList.contains('btn-secondary'))
                element.classList.add('btn-secondary');
        });
        const el = document.getElementById(id) as HTMLButtonElement;
        if (el) {
            el.classList.remove('btn-secondary');
            el.classList.add('btn-success');
        }
    };

    const createSongAction = () => {
        setComponent(componentSong);
        switchBtn("anime-filter-song");
    };
    const createTypeAction = () => {
        setComponent(componentType);
        switchBtn("anime-filter-type");
    };


    return (
        <div className="row">
            <div className="col-12 d-flex">
                <button id="artist-return" className="btn artist-return m-1" onClick={() => pageProps.pages().getLastPage()}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h2>{name}</h2>
            </div>
            <div className="col-12">
                <h5>{nameJP}</h5>
            </div>
            <div className="col mt-3" id="search-anime">
                <button id="anime-filter-song" onClick={createSongAction} className="anime-filter btn btn-success m-1">All Song</button>
                <button id="anime-filter-type" onClick={createTypeAction} className="anime-filter btn btn-secondary m-1">by Type</button>
            </div>
            <div className="col-12 mt-3">
                {component}
            </div>
        </div>
    );
}

export default Anime