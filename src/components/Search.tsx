import { useEffect, useState } from 'react';
import JsonSong from '../type/Songs';
import SearchAnime from './Search/SearchAnime';
import SearchAll from './Search/SearchAll';
import SearchSong from './Search/SearchSong';
import SearchArtist from './Search/SearchArtist';
import MessageCom from './MessageCom';
import { useIndexedDB } from 'react-indexed-db-hook';

interface SearchProps {
    searchString: string;
}

function Search({ searchString }: SearchProps) {
    const [componentArray, setComponentArray] = useState<JSX.Element[]>([]);
    const { add } = useIndexedDB("songs");
    const [songs, setSongs] = useState<JsonSong[]>([]);

    useEffect(() => {
        setComponentArray([<MessageCom key={"1"} msg="Pesquisando músicas, aguarde...." />])
        fetchAllSong();
    }, [searchString]);

    function requestBody() {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestBody = {
            anime_search_filter: {
                search: searchString,
                partial_match: true
            },
            song_name_search_filter: {
                search: searchString,
                partial_match: true
            },
            artist_search_filter: {
                search: searchString,
                partial_match: true,
                group_granularity: 0,
                max_other_artist: 99
            },
            composer_search_filter: {
                search: searchString,
                partial_match: true,
                arrangement: true
            },
            and_logic: false,
            ignore_duplicate: false,
            opening_filter: true,
            ending_filter: true,
            insert_filter: true,
        };

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(requestBody),
            redirect: 'follow',
        };

        return requestOptions;
    }

    async function fetchAllSong() {
        const requestOptions = requestBody();

        try {
            const response = await fetch("https://anisongdb.com/api/search_request", requestOptions);
            if (!response.ok)
                throw new Error('Erro na solicitação');

            const resultText = await response.text();
            const result = JSON.parse(resultText);
            setSongs(result);
            createAll(result);
            saveDatabase(result);
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    const switchBtn = (id: string) => {
        const elements = document.querySelectorAll('.search-filter');
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

    const createAllAction = () => createAll();

    const createAll = (song?: JsonSong[]) => {
        switchBtn("search-filter-all");
        const components: JSX.Element[] = [];
        if (song) {
            if (song.length > 0)
                components.push(<SearchAll key={"3"} songList={song} />);
            else
                components.push(<MessageCom key={"2"} msg="Nada foi encontrado nada..." />)
        }
        else if (songs.length === 0)
            components.push(<MessageCom key={"1"} msg="Nada foi encontrado nada..." />)
        else
            components.push(<SearchAll key={"0"} songList={songs} />);
        setComponentArray(components);
    };

    const createAnimeAction = () => {
        switchBtn("search-filter-anime");
        const components: JSX.Element[] = [];
        if (songs.length === 0)
            components.push(<MessageCom msg="Nada foi encontrado anime..." />)
        else {
            const groupSong = songs.reduce((acc: { [x: string]: any[]; }, obj: JsonSong) => {
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
                components.push(<SearchAnime key={key} songList={value} />);
        }
        setComponentArray(components)
    };

    const createSongAction = () => {
        switchBtn("search-filter-song");
        const components: JSX.Element[] = [];
        if (songs.length === 0)
            components.push(<MessageCom msg="Nada foi encontrado música..." />)
        else {
            const groupSong: { [letter: string]: JsonSong[] } = {};
            songs.forEach((item) => {
                const initialLetter = item.songName.charAt(0).toUpperCase();

                if (!groupSong[initialLetter])
                    groupSong[initialLetter] = [];

                groupSong[initialLetter].push(item);
            });

            const sortedKeys = Object.keys(groupSong).sort();
            sortedKeys.forEach((key) => {
                components.push(<SearchSong key={key} songList={groupSong[key]} />);
            });

        }
        setComponentArray(components);
    };

    const createArtistAction = () => {
        switchBtn("search-filter-artist");
        const components: JSX.Element[] = [];
        if (songs.length === 0)
            components.push(<MessageCom msg="Nada foi encontrado artistas..." />)
        else {
            const groupSong: { [artist: string]: JsonSong[] } = {};
            songs.forEach((item) => {
                const artists = item.songArtist;
                if (!groupSong[artists])
                    groupSong[artists] = [];

                groupSong[artists].push(item);
            });

            const sortedKeys = Object.keys(groupSong).sort();
            sortedKeys.forEach((key) => {
                components.push(<SearchArtist key={key} songList={groupSong[key]} />);
            });
        }
        setComponentArray(components);
    };

    const saveDatabase = (songList: JsonSong[]) => {
        songList.forEach((v) => {
            const data = {
                annSongId: v.annSongId,
                annId: v.annId,
                animeENName: v.animeENName,
                animeJPName: v.animeJPName,
                animeVintage: v.animeVintage,
                animeType: v.animeType,
                songType: v.songType,
                songName: v.songName,
                songArtist: v.songArtist,
                HQ: v.HQ,
                MQ: v.MQ,
                audio: v.audio,
                composers: v.composers
            };

            add(data).then(
                (event) => {
                    event = event;
                },
                (error) => {
                    error = error;
                },
            );
        });

    };

    return (
        <div className='row'>
            <div className="col mt-3" id="search-anime">
                <button id="search-filter-all" onClick={createAllAction} className="search-filter btn btn-success m-1">All</button>
                <button id="search-filter-song" onClick={createSongAction} className="search-filter   btn btn-secondary m-1">Song Name</button>
                <button id="search-filter-anime" onClick={createAnimeAction} className="search-filter btn btn-secondary m-1">Anime Name</button>
                <button id="search-filter-artist" onClick={createArtistAction} className="search-filter btn btn-secondary m-1">Artist Name</button>
                {componentArray}
            </div>
        </div>
    );
}

export default Search;
