import { useEffect, useState } from 'react';
import JsonSong from '../type/Songs';
import SearchAnime from './SearchAnime';
import SearchAll from './SearchAll';
import SearchSong from './SearchSong';
import SearchArtist from './SearchArtist';
import MessageCom from './MessageCom';

interface SearchProps {
    searchString: string;
}

function Search({ searchString }: SearchProps) {
    const [componentArray, setComponentArray] = useState<JSX.Element[]>([]);

    const fetchs = fetchDatas(searchString);
    useEffect(() => {
        fetchs.fetchSongAll(createAllAction);
        switchBtn("search-filter-all");
    }, [searchString]);

    const switchBtn = (id: string) => {
        const elements = document.querySelectorAll('.search-filter');
        elements.forEach(element => {
            if (element.classList.contains('btn-success'))
                element.classList.remove('btn-success');
            if (!element.classList.contains('btn-secondary'))
                element.classList.add('btn-secondary');
        });
        const el = document.getElementById(id) as HTMLButtonElement;
        el.classList.remove('btn-secondary');
        el.classList.add('btn-success');
    };

    const createAll = () => {
        fetchs.fetchSongAll(createAllAction);
        switchBtn("search-filter-all");
    };

    const createAllAction = (songs: JsonSong[]) => {
        const components: JSX.Element[] = [];
        if (songs.length === 0)
            components.push(<MessageCom msg="Nada foi encontrado nada..." />)
        else
            components.push(<SearchAll key={0} songList={songs} />);
        setComponentArray(components);
    };

    const createAnime = () => {
        fetchs.fetchSongAll(createAnimeAction);
        switchBtn("search-filter-anime");
    };

    const createAnimeAction = (songs: JsonSong[]) => {
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

            for (const [key, value] of entries) {
                components.push(<SearchAnime key={key} songList={value} />);
            }
        }
        setComponentArray(components)
    };

    const createSong = () => {
        fetchs.fetchSongAll(createSongAction);
        switchBtn("search-filter-song");
    };

    const createSongAction = (songs: JsonSong[]) => {
        const components: JSX.Element[] = [];
        if (songs.length === 0)
            components.push(<MessageCom msg="Nada foi encontrado música..." />)
        else {
            const groupSong: { [letter: string]: JsonSong[] } = {};
            songs.forEach((item) => {
                const initialLetter = item.songName.charAt(0).toUpperCase();

                if (!groupSong[initialLetter]) {
                    groupSong[initialLetter] = [];
                }
                groupSong[initialLetter].push(item);
            });

            const sortedKeys = Object.keys(groupSong).sort();
            sortedKeys.forEach((key) => {
                components.push(<SearchSong key={key} songList={groupSong[key]} />);
            });

        }
        setComponentArray(components);
    };

    const createArtist = () => {
        fetchs.fetchSongAll(createArtistAction);
        switchBtn("search-filter-artist");
    };

    const createArtistAction = (songs: JsonSong[]) => {
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

    return (
        <div className='row'>
            <div className="col mt-3" id="search-anime">
                <button id="search-filter-all" onClick={createAll} className="search-filter btn btn-success m-1">All</button>
                <button id="search-filter-song" onClick={createSong} className="search-filter   btn btn-secondary m-1">Song Name</button>
                <button id="search-filter-anime" onClick={createAnime} className="search-filter btn btn-secondary m-1">Anime Name</button>
                <button id="search-filter-artist" onClick={createArtist} className="search-filter btn btn-secondary m-1">Artist Name</button>
                {componentArray}
            </div>
        </div>
    );
}


type ActionAllFunc = (songs: JsonSong[]) => void;

function fetchDatas(searchString: string) {
    async function fetchSongAll(action: ActionAllFunc) {
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

        try {
            const response = await fetch("https://anisongdb.com/api/search_request", requestOptions);
            if (!response.ok)
                throw new Error('Erro na solicitação');


            const resultText = await response.text();

            action(JSON.parse(resultText));
        } catch (error) {
            console.error('Erro:', error);
        }
    };

    return {
        fetchSongAll
    }
}

export default Search;
