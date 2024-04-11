import { useEffect, useState } from 'react';
import JsonSong from '../type/Songs';
import PagesType from '../type/PagesType';
import SearchAnime from './Search/SearchAnime';
import SearchAll from './Search/SearchAll';
import SearchSong from './Search/SearchSong';
import SearchArtist from './Search/SearchArtist';
import MessageCom from './MessageCom';
import { feacthAniSong } from '../services/feacthAniSong';
import DBType from '../type/DBType';
import { useNavigate, useParams } from 'react-router-dom';
import HomeNav from './Home/HomeNav';

interface SearchProps {
    pageProps: () => PagesType;
    dbProp: DBType;
}

function Search({ pageProps, dbProp }: SearchProps) {
    const { parse } = useParams<string>();
    const searchString = parse || "";
    const [componentAll, setComponentAll] = useState<JSX.Element[]>([]);
    const [componentAnime, setComponentAnime] = useState<JSX.Element[]>([]);
    const [componentSong, setComponentSong] = useState<JSX.Element[]>([]);
    const [componentArtist, setComponentArtist] = useState<JSX.Element[]>([]);
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [timeLeft, SetTimeLeft] = useState<number>(0);
    const [showBTNs, setShowBTNs] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const inputSearch = document.getElementById('search-value') as HTMLInputElement;
        inputSearch["value"] = searchString;
        setShowBTNs(false);

        checkRanked();
        setComponent([<MessageCom key={"1"} msg="Searching, wait..." />])
        searchAllSong();
    }, [searchString]);

    async function searchAllSong() {
        try {
            const result = await feacthAniSong().fetchAllSong(searchString);
            createAll(result);
            createAnime(result);
            createSong(result);
            createArtist(result);
            dbProp.saveSongList(result);
            setShowBTNs(true);
        } catch (error) {
            setComponent([<MessageCom key={"432"} msg="Api off-line" />])
        }
    }

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

    const createAll = (song: JsonSong[]) => {
        const components: JSX.Element[] = [];
        if (song) {
            if (song.length === 0)
                components.push(<MessageCom key={"2"} msg="Not found..." />)
            else
                components.push(<SearchAll key={"3"} songList={song} pageProps={pageProps} />);
        }
        setComponentAll(components);
        switchBtn("search-filter-all");
        setComponent(components);
    };

    const createAnime = (song: JsonSong[]) => {
        const components: JSX.Element[] = [];
        if (song) {
            if (song.length === 0)
                components.push(<MessageCom msg="Not found (anime)..." />)
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

    const createSong = (song: JsonSong[]) => {
        const components: JSX.Element[] = [];
        if (song) {
            if (song.length === 0)
                components.push(<MessageCom msg="Song not found..." />)
            else {
                const groupSong: { [letter: string]: JsonSong[] } = {};
                song.forEach((item) => {
                    const initialLetter = item.songName.charAt(0).toUpperCase();

                    if (!groupSong[initialLetter])
                        groupSong[initialLetter] = [];

                    groupSong[initialLetter].push(item);
                });

                const sortedKeys = Object.keys(groupSong).sort();
                sortedKeys.forEach((key) => {
                    components.push(<SearchSong key={key} songList={groupSong[key]} pageProps={pageProps} />);
                });

            }
        }
        setComponentSong(components);
    };

    const createArtist = (song: JsonSong[]) => {
        const components: JSX.Element[] = [];
        if (song) {
            if (song.length === 0)
                components.push(<MessageCom msg="Not found (artist)..." />)
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

    const createAllAction = () => {
        setComponent(componentAll);
        switchBtn("search-filter-all");
    };
    const createSongAction = () => {
        setComponent(componentSong);
        switchBtn("search-filter-song");
    };
    const createAnimeAction = () => {
        setComponent(componentAnime);
        switchBtn("search-filter-anime");
    };
    const createArtistAction = () => {
        setComponent(componentArtist);
        switchBtn("search-filter-artist");
    };

    const alertRankedTime = () => {
        const intervalId = setInterval(() => {
            const timeLeft = checkTimeRanked();
            SetTimeLeft(timeLeft);
            if (timeLeft <= 0)
                clearInterval(intervalId);
        }, 5000);
    }

    const checkTimeRanked = () => {
        const now = new Date();
        const start = 20 * 60 + 30; // 20:30 convertido em minutos
        const end = 21 * 60 + 23; // 21:23 convertido em minutos
        const fuso = ["Asia/Tokyo", "America/Chicago", "Europe/Paris"];

        for (let i = 0; i < fuso.length; i++) {
            const now_fuso = new Date(now.toLocaleString("en-US", { timeZone: fuso[i] }));
            const hours = now_fuso.getHours();
            const minutes = now_fuso.getMinutes();
            const now_minutes = hours * 60 + minutes;

            if (now_minutes >= start && now_minutes <= end)
                return end - now_minutes;
        }
        return 0;
    }

    const checkRanked = () => {
        if (checkTimeRanked() > 0)
            alertRankedTime();
    }

    const shareThisPage = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Anime Song Player: ' + searchString,
                text: 'Search: ' + searchString,
                url: window.location.href,
            })
                .then(() => console.log('Conteúdo compartilhado!'))
                .catch((erro) => console.log('Erro ao compartilhar', erro));
        }
    };

    return (
        <div id="display-main" className="container-fluid displays">
            <div className="App  pb-4">
                <div className='row'>
                    {<HomeNav />}
                    {timeLeft > 0 &&
                        <div className='col-12 ps-4 bg-warning text-dark mb-4'>
                            <h1>Ranked AMQ Alert</h1>
                            <h5>Time left: {timeLeft} minutes</h5>
                            <p>During ranked AMQ matches, some search functions are limited, such as searching by artist or song name.</p>
                        </div>
                    }
                    <div className='col-12 ps-4'>
                        <h1>{searchString}</h1>
                    </div>
                    {showBTNs && <>
                        <div className="col-12 mt-3" id="search-anime">
                            <button className='btn btn-outline-secondary m-1 px-2' onClick={() => navigate(-1)}>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button className="btn btn-outline-success m-1" onClick={shareThisPage}><i className="bi bi-share-fill me-1"></i>Share</button>
                            <br />
                            <button id="search-filter-all" onClick={createAllAction} className="search-filter btn btn-success m-1">All</button>
                            <button id="search-filter-song" onClick={createSongAction} className="search-filter btn btn-secondary m-1">Song Name</button>
                            <button id="search-filter-anime" onClick={createAnimeAction} className="search-filter btn btn-secondary m-1">Anime Name</button>
                            <button id="search-filter-artist" onClick={createArtistAction} className="search-filter btn btn-secondary m-1">Artist Name</button>
                        </div>

                    </>}
                    <div className="col-12 mt-3">
                        {component}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
