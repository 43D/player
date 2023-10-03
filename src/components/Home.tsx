import { useEffect, useState } from "react";
import MessageCom from "./MessageCom";
import HomeDefault from "./Home/HomeDefault";
import HomeMostWanted from "./Home/HomeMostWanted";
import HomeAllSongs from "./Home/HomeAllSongs";
import HomeArtist from "./Home/HomeArtist";
import HomeComposer from "./Home/HomeComposer";
import HomeAnime from "./Home/HomeAnime";
import HomePlaylist from "./Home/HomePlaylist";

function Home() {
    const [componentArray, setComponentArray] = useState<JSX.Element[]>([]);
    const [componentHome, setcomponentHome] = useState<JSX.Element[]>([]);
    const [componentPlaylist, setcomponentPlaylist] = useState<JSX.Element[]>([]);
    const [componentMostWanted, setcomponentMostWanted] = useState<JSX.Element[]>([]);
    const [componentAllSongs, setcomponentAllSongs] = useState<JSX.Element[]>([]);
    const [componentArtist, setcomponentArtist] = useState<JSX.Element[]>([]);
    const [componentComposer, setcomponentComposer] = useState<JSX.Element[]>([]);
    const [componentAnime, setcomponentAnime] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setComponentArray([<MessageCom key={"1"} msg="Pesquisando músicas, aguarde...." />]);
        const home = <HomeDefault key={"h1"} />;
        setComponentArray([home]);
        setcomponentHome([home]);

        setcomponentPlaylist([<HomePlaylist key={"h2"} />]);
        setcomponentMostWanted([<HomeMostWanted key={"h3"} />]);
        setcomponentAllSongs([<HomeAllSongs key={"h4"} />]);
        setcomponentArtist([<HomeArtist key={"h5"} />]);
        setcomponentComposer([<HomeComposer key={"h6"} />]);
        setcomponentAnime([<HomeAnime key={"h7"} />]);

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

    const createHomeAction = () => {
        switchBtn("main-filter-home");
        setComponentArray(componentHome);
    };

    const createPlaylistction = () => {
        switchBtn("main-filter-playlist");
        setComponentArray(componentPlaylist);
    };

    const createMostAction = () => {
        switchBtn("main-filter-most");
        setComponentArray(componentMostWanted);
    };

    const createAllAction = () => {
        switchBtn("main-filter-all");
        setComponentArray(componentAllSongs);
    };

    const createArtistAction = () => {
        switchBtn("main-filter-artist");
        setComponentArray(componentArtist);
    };

    const createComposerAction = () => {
        switchBtn("main-filter-composer");
        setComponentArray(componentComposer);
    };

    const createAnimeAction = () => {
        switchBtn("main-filter-anime");
        setComponentArray(componentAnime);
    };

    return (
        <div className="row">
            <div className="col">
                <button id="main-filter-home" onClick={createHomeAction} className="btn btn-success home-filter m-1">Home</button>
                <button id="main-filter-playlist" onClick={createPlaylistction} className="btn btn-secondary home-filter m-1">Playlist</button>
                <button id="main-filter-most" onClick={createMostAction} className="btn btn-secondary home-filter m-1">Mais escutadas</button>
                <button id="main-filter-all" onClick={createAllAction} className="btn btn-secondary home-filter m-1">Todas músicas</button>
                <button id="main-filter-artist" onClick={createArtistAction} className="btn btn-secondary home-filter m-1">Artistas</button>
                <button id="main-filter-composer" onClick={createComposerAction} className="btn btn-secondary home-filter m-1">Compositores</button>
                <button id="main-filter-anime" onClick={createAnimeAction} className="btn btn-secondary home-filter m-1">Animes</button>
                <div className="row">
                    {componentArray}
                </div>
            </div>
        </div>
    );
}

export default Home