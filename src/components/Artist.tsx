import { useEffect, useState } from "react";
import PagesType from "../type/PagesType";
import MessageCom from "./MessageCom";
import { feacthAniSong } from "../services/feacthAniSong";
import JsonSong from "../type/Songs";
import ArtistAll from "./Artist/ArtistAll";
import ArtistAnime from "./Artist/ArtistAnime";
import DBType from "../type/DBType";
import { Navigate, useParams } from "react-router-dom";
import HomeNav from "./Home/HomeNav";

type idType = {
    pageProps: () => PagesType;
    dbProp: DBType;
}

function Artist({ pageProps, dbProp }: idType) {
    const { idArtist } = useParams<string>();
    const id = idArtist ? parseInt(idArtist, 10) : 0;
    if (id == 0)
        return <Navigate replace to="/404" />

    const [name, setName] = useState<String>("");
    const [result, setResult] = useState<JsonSong[] | null>(null);
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [componentAll, setComponentAll] = useState<JSX.Element[]>([]);
    const [componentArtist, setComponentArtist] = useState<JSX.Element[]>([]);
    const [componentComposer, setComponentComposer] = useState<JSX.Element[]>([]);
    const [componentAnime, setComponentAnime] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setComponent([<MessageCom key={"43"} msg="Pesquisando músicas, aguarde...." />])
        searchAllSong();
    }, [id]);

    async function searchAllSong() {
        try {
            const resultArtist = await feacthAniSong().fetchArtistById(id);
            const resultComposer = await feacthAniSong().fetchComposerById(id);
            const result = unionArray(resultArtist, resultComposer);
            searchName(result);

            const compAll = <ArtistAll key={"21"} songList={result} pageProps={pageProps} />
            setComponentAll([compAll]);

            const compArt = <ArtistAll key={"22"} songList={resultArtist} pageProps={pageProps} />
            setComponentArtist([compArt]);

            const compCom = <ArtistAll key={"23"} songList={resultComposer} pageProps={pageProps} />
            setComponentComposer([compCom]);

            createAnime(result);

            setComponent([compAll]);

            dbProp.saveSongList(result);
            setResult(result);
        } catch (error) {
            setComponent([<MessageCom key={"431"} msg="Api off-line" />])
        }
    }

    const unionArray = (arr1: JsonSong[], arr2: JsonSong[]) => {
        const resultAll = arr1.concat(arr2);
        const resultUnique = resultAll.filter((obj: JsonSong, index: number, self: JsonSong[]) =>
            index === self.findIndex((o: JsonSong) => o.annSongId === obj.annSongId)
        );

        return resultUnique;
    }

    const searchName = (songs: JsonSong[]) => {
        if (songs[0].artists.length > 0)
            searchNamePeople(songs[0].artists);

        if (songs[0].composers.length > 0)
            searchNamePeople(songs[0].composers);

        if (songs[0].arrangers.length > 0)
            searchNamePeople(songs[0].arrangers);
    }

    const searchNamePeople = (loop: any) => {
        loop.forEach((people: any) => {
            if (people.id === id)
                setName(people.names.toString());
            else if (people.members) {
                people.members.forEach((v: any) => {
                    if (v.id === id)
                        setName(v.names.toString());
                });
            }
        });
    }

    const switchBtn = (id: string) => {
        const elements = document.querySelectorAll('.artist-filter');
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

    const createAnime = (song: JsonSong[]) => {
        const components: JSX.Element[] = [];

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
            components.push(<ArtistAnime key={key} songList={value} pageProps={pageProps} />);


        setComponentAnime(components)
    };


    const createAllAction = () => {
        setComponent(componentAll);
        switchBtn("artist-filter-song");
    };
    const createArtistAction = () => {
        setComponent(componentArtist);
        switchBtn("artist-filter-artist");
    };
    const createComposerAction = () => {
        setComponent(componentComposer);
        switchBtn("artist-filter-composer");
    };
    const createCAnimeAction = () => {
        setComponent(componentAnime);
        switchBtn("artist-filter-anime");
    };

    const playSongs = () => {
        if (result) {
            const sortedSongs = [...result].sort((a, b) => a.songName.localeCompare(b.songName));

            let arr = [] as string[];
            for (const value of sortedSongs) {
                arr.push(value.annSongId + "");
            }
            pageProps().playArtistNow(arr);
        }
    }

    return (
        <div id="display-main" className="container-fluid displays">
            <div className="App pt-2 pb-4">
                <div className="row">
                    {<HomeNav />}
                    <div className="col-12 d-flex align-items-center">
                        <h2>{name}</h2>
                    </div>
                    <div className="col-12">
                        Composer and Artist
                    </div>
                    <div className="col mt-3" id="search-anime">
                        <button className="btn btn-success m-1" onClick={playSongs}><i className="bi bi-play"></i></button>
                        <button id="artist-filter-song" onClick={createAllAction} className="artist-filter btn btn-success m-1">All Songs</button>
                        <button id="artist-filter-anime" onClick={createCAnimeAction} className="artist-filter btn btn-secondary m-1">by Anime</button>
                        <button id="artist-filter-artist" onClick={createArtistAction} className="artist-filter btn btn-secondary m-1">is Artist</button>
                        <button id="artist-filter-composer" onClick={createComposerAction} className="artist-filter btn btn-secondary m-1">is Composer/Arranger</button>
                    </div>
                    <div className="col-12 mt-3">
                        {component}
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Artist