import { Link } from "react-router-dom";
import PagesType from "../../type/PagesType";
import PlaylistCardType from "../../type/PlaylistCardType";

interface CardProps {
    playlist: PlaylistCardType;
    pageProps: () => PagesType;
}

function PlaylistCard({ playlist, pageProps }: CardProps) {
    return (
        <div className="card card-playlist col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="card-body">
                <h5 className="card-title text-center">{playlist.title}</h5>
                <p className="text-center">{playlist.songsCollections.length} songs</p>
                <div className="w-100 d-flex justify-content-center">
                    <Link className="btn btn-outline-secondary mt-2" to={"/playlist/" + playlist.id}>Open PlayList</Link>
                    <button className="btn btn-outline-success mt-2 mx-1" onClick={() => pageProps().playPlaylistNow(playlist.id)}><i className="bi bi-play"></i></button>
                    <button className="btn btn-outline-danger mt-2" onClick={() => pageProps().deletePlaylist(playlist.id)}>Delete</button>
                </div>
            </div>
        </div>
    );
}

export default PlaylistCard