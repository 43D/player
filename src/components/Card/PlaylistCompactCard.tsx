import PagesType from "../../type/PagesType";
import PlaylistCardType from "../../type/PlaylistCardType";

interface CardProps {
    playlist: PlaylistCardType;
    pageProps: PagesType;
}

function PlaylistCompactCard({ playlist, pageProps }: CardProps) {
    return (
        <div className="card col-6 col-md-4 col-lg-3">
            <div className="card-body d-flex justify-content-between flex-column">
                <h5 className="card-title">{playlist.title}</h5>
                <div className="w-100">
                    <a href="#" className="btn btn-outline-secondary mt-2 w-100" onClick={() => pageProps.pages().getPlaylist(playlist.id)}>Open</a>
                </div>
            </div>
        </div>
    );
}

export default PlaylistCompactCard