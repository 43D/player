import { Link } from 'react-router-dom';
import PagesType from '../../type/PagesType';
import JsonSong from '../../type/Songs';

interface CardProps {
    song: JsonSong;
    pageProps: () => PagesType;
    count: number;
}

function AnimeSongListenedCard({ song, pageProps, count }: CardProps) {
    const composers = song.composers;
    const artists = song.artists;
    const arrangers = song.arrangers;

    return (
        <li className="list-group-item">
            <div className="row">
                <div className="col-3 col-sm-2 col-lg-1 border-end d-flex align-items-center">
                    <button onClick={() => pageProps().playSongNow(song.annSongId)}
                        className={`btn w-100 play-now song-id-${song.annSongId}`}>
                        <i className="bi bi-play"></i>
                    </button>
                </div>
                <div className="col-7 col-sm d-flex justify-content-between align-items-center" data-bs-toggle="collapse"
                    data-bs-target={`#music-name-${song.annSongId}`}>
                    <p className='m-0 p-0'>{song.songName}</p>
                    <p className='m-0 p-0'>played {count} times</p>
                </div>
                <div className="col-2 col-sm-1 d-flex align-items-center justify-content-end border-start">
                    <button className="btn w-100" data-bs-toggle="dropdown" aria-expanded="false">
                        <i className="bi bi-three-dots"></i>
                    </button>
                    <ul className="dropdown-menu z-index-1035">
                        <li>
                            <button className={`dropdown-item add-queue song-id-${song.annSongId}`}
                                onClick={() => pageProps().addQueue(song.annSongId)}>
                                <i className="bi bi-collection"></i> Add to Play queue
                            </button>
                        </li>
                        <li>
                            <button className={`dropdown-item add-playlist song-id-${song.annSongId}`}
                                onClick={() => pageProps().addPlaylistModal(song.annSongId)}>
                                <i className="bi bi-journal-plus"></i> Add to a PlayList
                            </button>
                        </li>
                        <li data-bs-toggle="collapse" data-bs-target={`#music-name-${song.annSongId}`}>
                            <button className="dropdown-item">
                                <i className="bi bi-collection"></i> Song information
                            </button>
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
                            <td>
                                <Link to={"/anime/" + song.annId}>{song.animeENName}</Link>
                            </td>
                            <td colSpan={2}>
                                <Link to={"/anime/" + song.annId}>{song.animeJPName}</Link>
                            </td>
                        </tr>
                        <tr>
                            <th>Artist</th>
                            <td colSpan={3}>
                                {artists.map((item) => (
                                    <span key={item.id}>
                                        <Link to={"/artist/" + item.id}>{item.names.toString()}</Link>
                                    </span>
                                ))}
                            </td>
                        </tr>
                        <tr>
                            <th>composers</th>
                            <td colSpan={3}>
                                {composers.map((item) => (
                                    <span key={item.id}>
                                        <Link to={"/artist/" + item.id}>{item.names.toString()}</Link>
                                    </span>

                                ))}
                            </td>
                        </tr>
                        <tr>
                            <th>arrangers</th>
                            <td colSpan={3}>
                                {arrangers.map((item) => (
                                    <span key={item.id}>
                                        <Link to={"/artist/" + item.id}>{item.names.toString()}</Link>
                                    </span>
                                ))}
                            </td>
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

export default AnimeSongListenedCard