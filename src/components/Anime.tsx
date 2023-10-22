import PagesType from "../type/PagesType";
import { useEffect, useState } from "react";
import MessageCom from "./MessageCom";
import { feacthAniSong } from "../services/feacthAniSong";
import AnimeAll from "./Anime/AnimeAll";
import AnimeType from "./Anime/AnimeType";
import DBType from "../type/DBType";

type idType = {
    id: number;
    pageProps: PagesType;
    dbProp: DBType;
}

function Anime({ id, pageProps, dbProp }: idType) {
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
        try {
            const result = await feacthAniSong().fetchSongById(id);
            setName(result[0].animeENName);
            setNameJP(result[0].animeJPName + " - " + result[0].animeVintage + " (" + result[0].animeType + ")");
            
            const compSong = <AnimeAll key={"13"} songList={result} pageProps={pageProps} />
            setComponentSong([compSong]);
            
            const compType = <AnimeType key={"14"} songList={result} pageProps={pageProps} />
            setComponentType([compType]);
            
            setComponent([compSong]);
            
            dbProp.saveSongList(result);
        } catch (error) {
            setComponent([<MessageCom key={"433"} msg="Api off-line" />])
        }
        
        
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
            <div className="col-12 d-flex align-items-center">
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