import { useEffect, useState } from 'react';
import DBType from '../../type/DBType';
import PagesType from '../../type/PagesType';
import { useNavigate } from 'react-router-dom';

interface CardProps {
    id: string;
    pageProps: () => PagesType;
    dbProp: DBType;
    playIndex: number;
    indexQueue: number;
}

function AnimeSongQueueCard({ id, pageProps, dbProp, playIndex, indexQueue }: CardProps) {
    const navigate = useNavigate();
    const [songName, setSongName] = useState<string>("");
    const [songArtist, setSongArtist] = useState<string>("");
    const [anime, setAnime] = useState<string>("");
    const [style, setStyle] = useState<boolean>(false);
    const [link, setLink] = useState<string>("/anime/" + id);

    useEffect(() => {

        const getSongInfo = async () => {
            const songData = await dbProp.getSongById(Number(id));
            setLink("/anime/" + songData.annId);
            setSongName(songData.songName);
            setSongArtist(songData.songArtist);
            setAnime(songData.animeENName);
            if (indexQueue == playIndex)
                setStyle(true);
            else
                setStyle(false);

        }
        getSongInfo();
    }, []);


    useEffect(() => {
        if (indexQueue == playIndex)
            setStyle(true);
        else
            setStyle(false);
    }, [playIndex, indexQueue]);


    return (
        <li className={style ? "list-group-item bg-success" : "list-group-item"}>
            <div className="row">
                <div className="col-3 col-sm-2 col-lg-1 border-end d-flex align-items-center">
                    <button onClick={() => pageProps().playQueueId(indexQueue)}
                        className="btn w-100 play-now">
                        <i className="bi bi-play"></i>
                    </button>
                </div>
                <div className="col-7 col-sm d-flex queue-list-title" style={{wordBreak: 'break-all'}} data-bs-toggle="collapse"
                    data-bs-target={`#music-name-${Number(id)}`}>
                    <p className='m-0 p-0'><span>「{songName}」</span><span>【{songArtist}】</span></p>
                    <p className='m-0 p-0'>{anime}</p>
                </div>
                <div className="col-2 col-sm-1 d-flex align-items-center justify-content-end border-start">
                    <button className="btn w-100" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-three-dots"></i>
                    </button>
                    <ul className="dropdown-menu z-index-1035">
                        <li>
                            <button className={`dropdown-item add-queue song-id-${Number(id)}`}
                                onClick={() => pageProps().removeQueue(Number(id))}>
                                <i className="bi bi-x-circle"></i> Remove from queue
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item add-playlist song-id-${Number(id)}`}
                                onClick={() => navigate(link)}>
                                <i className="bi bi-collection"></i> Open anime profile
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </li>
    );
}

export default AnimeSongQueueCard