import PagesType from "../type/PagesType";
import { useEffect, useState } from "react";
import MessageCom from "./MessageCom";
import { feacthAniSong } from "../services/feacthAniSong";
import AnimeAll from "./Anime/AnimeAll";
import AnimeType from "./Anime/AnimeType";
import DBType from "../type/DBType";
import JsonSong from "../type/Songs";
import { feacthAnimeInfo } from "../services/feacthAnimeInfo";
import AnimeInfo from "../type/AnimeInfo";
import AnimeInfomation from "./Anime/AnimeInfomation";

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
    const [componentInfo, setComponentInfo] = useState<JSX.Element[]>([]);


    useEffect(() => {
        setComponent([<MessageCom key={"43"} msg="Pesquisando músicas, aguarde...." />])
        searchAllSong();
    }, [id]);

    const searchAllSong = async () => {
        try {
            const result = await feacthAniSong().fetchSongById(id);
            await searchAnimeInfo(result[0]);
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

    const searchAnimeInfo = async (song: JsonSong) => {
        const year = (song.animeVintage) ? song.animeVintage.split(" ")[1] : "1900";
        const animeEN = await feacthAnimeInfo().fetchAnimeInfo(song.animeENName, year);
        let result = searchMatch(animeEN, song);
        if (!result) {
            const animeJP = await feacthAnimeInfo().fetchAnimeInfo(song.animeJPName, year);
            result = searchMatch(animeJP, song);
        }
        if (result)
            setComponentInfo([<AnimeInfomation key={"9787"} anime={result} />]);
    }

    const searchMatch = (anime: AnimeInfo, song: JsonSong): AnimeInfo | null => {
        if (!song.animeVintage)
            return null;
        for (let key in anime.data)
            if (anime.data[key].year + "" == song.animeVintage.split(" ")[1] || !anime.data[key].year)
                return filterByString(anime, key, song);

        return null;
    }

    const filterByString = (anime: AnimeInfo, key: any, song: JsonSong): AnimeInfo | null => {
        const value = anime.data[key];
        if (includeStringArray(value.title, song.animeENName, song.animeJPName))
            return {
                data: [value]
            };
        if (value.title_english)
            if (includeStringArray(value.title_english, song.animeENName, song.animeJPName))
                return {
                    data: [value]
                };

        for (let title in value.title_synonyms)
            if (includeStringArray(title, song.animeENName, song.animeJPName))
                return {
                    data: [value]
                };

        for (let title in value.titles) {
            const t = value.titles[title];
            if (includeStringArray(t.title, song.animeENName, song.animeJPName))
                return {
                    data: [value]
                };
        }
        return null;
    }

    const includeStringArray = (title: string, nameA: string, nameB: string) => {
        if (title.includes(nameA) || title.includes(nameB))
            return true;
        return false;
    }
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

    const createInfoAction = () => {
        setComponent(componentInfo);
        switchBtn("anime-filter-info");
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
                <button className="btn btn-success m-1" onClick={() => pageProps.pages().playAnimeNow(id)}><i className="bi bi-play"></i></button>
                <button id="anime-filter-song" onClick={createSongAction} className="anime-filter btn btn-success m-1">All Song</button>
                <button id="anime-filter-type" onClick={createTypeAction} className="anime-filter btn btn-secondary m-1">by Type</button>
                <button id="anime-filter-info" onClick={createInfoAction} className="anime-filter btn btn-secondary m-1">Information</button>
            </div>
            <div className="col-12 mt-3">
                {component}
            </div>
        </div>
    );
}

export default Anime