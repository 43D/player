import { useEffect, useState } from 'react';

interface SearchProps {
    searchString: string;
}

type Composer = {
    id: number;
    names: string[];
}
type JsonSong = {
    annId: number;
    annSongId: number;
    animeENName: string;
    animeJPName: string;
    animeVintage: string;
    animeType: string;
    songType: string;
    songName: string;
    songArtist: string;
    HQ: string;
    MQ: string;
    audio: string;
    composers: Composer[]

}

type SongsType = {
    [key: string]: JsonSong[];
};

function Search({ searchString }: SearchProps) {
    const [componentArray, setComponentArray] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            const requestBody = {
                song_name_search_filter: {
                    search: searchString,
                    partial_match: true,
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
                if (!response.ok) {
                    throw new Error('Erro na solicitação');
                }

                const resultText = await response.text();
                const groupedJson = JSON.parse(resultText).reduce((acc: { [x: string]: any[]; }, obj: { annId: any; }) => {
                    const key = obj.annId;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj);
                    return acc;
                }, {});

                createAnime(groupedJson);
            } catch (error) {
                console.error('Erro:', error);
            }
        };

        fetchData();
    }, [searchString]);

    function createAnime(songs: SongsType) {
        const components = [];
        for (const key in songs) {
            if (songs.hasOwnProperty(key)) {
                const value = songs[key];
                components.push(<Anime key={key} songList={value} />);
            }
        }
        setComponentArray(components)
    }


    return (
        <div className='row'>
            <div className="col" id="search-anime">
                <h2 className="my-4">Animes</h2>
                {componentArray}
            </div>
        </div>
    );
}


interface AnimeProps {
    songList: JsonSong[];
}

function Anime({ songList }: AnimeProps) {

    const [componentCard, setComponentCard] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const components = [];

        for (const key in songList) {
            if (songList.hasOwnProperty(key)) {
                const value = songList[key];
                components.push(<Card key={key} song={value} />);
            }
        }

        setComponentCard(components);
    }, [songList]);

    return (
        <div>
            <h4 className="my-2">{songList[0].animeENName}</h4>
            <ul className="list-group">
                {componentCard}
            </ul>
        </div>
    );
}

interface CardProps {
    song: JsonSong;
}

function Card({ song }: CardProps) {
    return (
        <li className="list-group-item">
            <div className="row">
                <div className="col-2 col-sm-2 col-lg-1 border-end d-flex align-items-center">
                    <button
                        className={`btn w-100 play-now song-id-${song.annSongId}`}>
                        <i className="bi bi-play"></i>
                    </button>
                </div>
                <div className="col-8 col-sm d-flex justify-content-start align-items-center" data-bs-toggle="collapse"
                    data-bs-target={`#music-name-${song.annSongId}`}>
                    {song.songName}
                </div>
                <div className="col-2 col-sm-1 d-flex align-items-center justify-content-end border-start">
                    <button className="btn w-100" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-three-dots"></i>
                    </button>
                    <ul className="dropdown-menu z-index-1035">
                        <li>
                            <a className={`dropdown-item add-queue song-id-${song.annSongId}`} href="#">
                                <i className="bi bi-collection"></i> Add to Play queue
                            </a>
                        </li>
                        <li data-bs-toggle="modal" data-bs-target="#addPlaylistModal">
                            <a className={`dropdown-item add-playlist song-id-${song.annSongId}`} href="#">
                                <i className="bi bi-journal-plus"></i> Add to a PlayList
                            </a>
                        </li>
                        <li data-bs-toggle="collapse" data-bs-target={`#music-name-${song.annSongId}`}>
                            <a className="dropdown-item" href="#" id="">
                                <i className="bi bi-collection"></i> Song information
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="collapse" id={`music-name-${song.annSongId}`}>
                <table className="table table-striped table-hover">
                    <tbody>
                        <tr>
                            <th>Song name</th>
                            <td>{song.songName}</td>
                            <th>Season</th>
                            <td>{song.animeVintage}</td>
                        </tr>
                        <tr>
                            <th>Anime</th>
                            <td>{song.animeENName}</td>
                            <td colSpan={2}>{song.animeJPName}</td>
                        </tr>
                        <tr>
                            <th>Artist</th>
                            <td colSpan={3}>{song.songArtist}</td>
                        </tr>
                        <tr>
                            <th>composers</th>
                            <td colSpan={3}>{song.composers.toString()}</td>
                        </tr>
                        <tr>
                            <th>Type</th>
                            <td>{song.songType}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </li>
    );
}

export default Search;
