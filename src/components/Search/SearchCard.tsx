import JsonSong from '../../type/Songs';

interface CardProps {
    song: JsonSong;
}

function SearchCard({ song }: CardProps) {
    let composers = "";
    song.composers.forEach((v) => composers += v.names.toString() + " ")

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
                            <td colSpan={3}>{composers}</td>
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

export default SearchCard