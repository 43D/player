import { Link } from "react-router-dom";
import PlaylistCardType from "../../type/PlaylistCardType";

interface CardProps {
    playlist: PlaylistCardType;
}

function PlaylistCompactCard({ playlist }: CardProps) {
    return (
        <div className="card col-6 col-md-4 col-lg-3">
            <div className="card-body d-flex justify-content-between flex-column">
                <h5 className="card-title">{playlist.title}</h5>
                <div className="w-100">
                    <Link className="btn btn-outline-secondary mt-2 w-100" to={"/player/playlist/" + playlist.id}>Open</Link>
                </div>
            </div>
        </div>
    );
}

export default PlaylistCompactCard