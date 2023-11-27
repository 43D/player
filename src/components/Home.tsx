import { useEffect, useState } from "react";
import MessageCom from "./MessageCom";
import HomeFeed from "./Home/HomeFeed";
import HomeMostWanted from "./Home/HomeMostWanted";
import HomeAllSongs from "./Home/HomeAllSongs";
import HomeArtist from "./Home/HomeArtist";
import HomeComposer from "./Home/HomeComposer";
import HomeAnime from "./Home/HomeAnime";
import HomePlaylist from "./Home/HomePlaylist";
import PagesType from "../type/PagesType";
import DBType from "../type/DBType";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
}

function Home({ pageProps, dbProp }: pageProps) {
    const [componentArray, setComponentArray] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setComponentArray([<MessageCom key={"1"} msg="Pesquisando músicas, aguarde...." />]);
        setComponentArray([<HomeFeed key={"h1"} pageProps={pageProps} dbProp={dbProp} homePages={homePages} />]);
    }, []);

    const switchBtn = (id: string) => {
        const elements = document.querySelectorAll('.home-filter');
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

    const homePages = () => {
        return {
            createHomeAction,
            createPlaylistction,
            createMostAction,
            createAllAction,
            createArtistAction,
            createComposerAction,
            createAnimeAction,
        }
    }

    const createHomeAction = () => {
        switchBtn("main-filter-home");
        setComponentArray([<HomeFeed key={"h1"} pageProps={pageProps} dbProp={dbProp} homePages={homePages} />]);
    };

    const createPlaylistction = () => {
        switchBtn("main-filter-playlist");
        setComponentArray([<HomePlaylist key={"h2"} pageProps={pageProps} dbProp={dbProp} />]);
    };

    const createMostAction = () => {
        switchBtn("main-filter-most");
        setComponentArray([<HomeMostWanted key={"h3"} pageProps={pageProps} dbProp={dbProp} />]);
    };

    const createAllAction = () => {
        switchBtn("main-filter-all");
        setComponentArray([<HomeAllSongs key={"h4"} pageProps={pageProps} dbProp={dbProp} />]);
    };

    const createArtistAction = () => {
        switchBtn("main-filter-artist");
        setComponentArray([<HomeArtist key={"h5"} dbProp={dbProp} />]);
    };

    const createComposerAction = () => {
        switchBtn("main-filter-composer");
        setComponentArray([<HomeComposer key={"h6"} dbProp={dbProp} />]);
    };

    const createAnimeAction = () => {
        switchBtn("main-filter-anime");
        setComponentArray([<HomeAnime key={"h7"} dbProp={dbProp} />]);
    };

    return (
        <div id="display-main" className="container-fluid displays">
            <div className="App pt-2 pb-4">
                <div className="row">
                    <div className="col">
                        <button id="main-filter-home" onClick={createHomeAction} className="btn btn-success home-filter m-1">Home</button>
                        <button id="main-filter-playlist" onClick={createPlaylistction} className="btn btn-secondary home-filter m-1">Playlist</button>
                        <button id="main-filter-most" onClick={createMostAction} className="btn btn-secondary home-filter m-1">Most listened</button>
                        <button id="main-filter-all" onClick={createAllAction} className="btn btn-secondary home-filter m-1">My songs</button>
                        <button id="main-filter-anime" onClick={createAnimeAction} className="btn btn-secondary home-filter m-1">Animes</button>
                        <button id="main-filter-artist" onClick={createArtistAction} className="btn btn-secondary home-filter m-1">Artists</button>
                        <button id="main-filter-composer" onClick={createComposerAction} className="btn btn-secondary home-filter m-1">Composers/Arrangers</button>
                        <div className="row justify-content-center">
                            {componentArray}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home