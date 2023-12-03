import PagesType from "../type/PagesType";
import { useEffect, useState } from "react";
import MessageCom from "./MessageCom";
import AnimeAll from "./Anime/AnimeAll";
import DBType from "../type/DBType";
import JsonSong from "../type/Songs";
import SearchAnime from "./Search/SearchAnime";
import SearchArtist from "./Search/SearchArtist";
import { Navigate, useParams } from "react-router-dom";

type idType = {
    pageProps: () => PagesType;
    dbProp: DBType;
}

function Playlist({ pageProps, dbProp }: idType) {
    const { idPlaylist } = useParams<string>();
    const id = idPlaylist ? parseInt(idPlaylist, 10) : 0;
    if (id == 0)
        return <Navigate replace to="/404" />

    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [name, setName] = useState<String>("");
    const [qtd, setQtd] = useState<number>(0);
    const [componentSong, setComponentSong] = useState<JSX.Element[]>([]);
    const [componentAnime, setComponentAnime] = useState<JSX.Element[]>([]);
    const [componentArtist, setComponentArtist] = useState<JSX.Element[]>([]);


    useEffect(() => {
        setComponent([<MessageCom key={"43"} msg="Pesquisando músicas, aguarde...." />])
        searchAllPlaylist();
    }, [id]);

    async function searchAllPlaylist() {
        try {
            const result = await dbProp.getByIdPlaylist(id);
            setName(result.title);
            setQtd(result.songsCollections.length);
            const songs = await dbProp.getCollectionSongs(result.songsCollections);

            const compSong = <AnimeAll key={"13"} songList={songs} pageProps={pageProps} />
            setComponentSong([compSong]);

            createAnime(songs);
            createArtist(songs);
            setComponent([compSong]);
        } catch (error) {
            setComponent([<MessageCom key={"433"} msg="Error pane geral" />])
        }


    };

    const createAnime = (song: JsonSong[]) => {
        const components: JSX.Element[] = [];
        if (song) {
            if (song.length === 0)
                components.push(<MessageCom msg="Nada foi encontrado anime..." />)
            else {
                const groupSong = song.reduce((acc: { [x: string]: any[]; }, obj: JsonSong) => {
                    const key = obj.annId;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                }, {});

                const entries = Object.entries(groupSong);
                entries.sort(([, a], [, b]) => a[0].animeENName.localeCompare(b[0].animeENName));

                for (const [key, value] of entries)
                    components.push(<SearchAnime key={key} songList={value} pageProps={pageProps} />);
            }
        }
        setComponentAnime(components)
    };

    const createArtist = (song: JsonSong[]) => {
        const components: JSX.Element[] = [];
        if (song) {
            if (song.length === 0)
                components.push(<MessageCom msg="Nada foi encontrado artistas..." />)
            else {
                const groupSong: { [artist: string]: JsonSong[] } = {};
                song.forEach((item) => {
                    const artists = item.songArtist;
                    if (!groupSong[artists])
                        groupSong[artists] = [];

                    groupSong[artists].push(item);
                });

                const sortedKeys = Object.keys(groupSong).sort();
                sortedKeys.forEach((key) => {
                    components.push(<SearchArtist key={key} songList={groupSong[key]} pageProps={pageProps} />);
                });
            }
        }
        setComponentArtist(components);
    };

    const switchBtn = (id: string) => {
        const elements = document.querySelectorAll('.playlist-filter');
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
    const createAnimeAction = () => {
        setComponent(componentAnime);
        switchBtn("anime-filter-anime");
    };

    const createArtistAction = () => {
        setComponent(componentArtist);
        switchBtn("anime-filter-artist");
    };


    return (
        <div id="display-main" className="container-fluid displays">
            <div className="App pt-2 pb-4">
                <div className="row">
                    <div className="col-12 d-flex align-items-center">
                        <h2>{name}</h2>
                    </div>
                    <div className="col-12">
                        <h5>{qtd} songs</h5>
                    </div>
                    <div className="col mt-3" id="search-anime">
                        <button className="btn btn-success m-1" onClick={() => pageProps().playPlaylistNow(id)}><i className="bi bi-play"></i></button>
                        <button id="anime-filter-song" onClick={createSongAction} className="playlist-filter btn btn-success m-1">All Song</button>
                        <button id="anime-filter-anime" onClick={createAnimeAction} className="playlist-filter btn btn-secondary m-1">Anime</button>
                        <button id="anime-filter-artist" onClick={createArtistAction} className="playlist-filter btn btn-secondary m-1">Artist/Composers/Arranger</button>
                    </div>
                    <div className="col-12 mt-3">
                        {component}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Playlist