import { Link } from "react-router-dom";
import PlaylistCardType from "../../type/PlaylistCardType";

interface CardProps {
    playlist: PlaylistCardType;
}

function PlaylistCompactCard({ playlist }: CardProps) {
    return (
        <div className="col-6 col-lg-4 p-1">
            <div className="card ">
                <div className="card-body d-flex justify-content-between flex-column">
                    <h5 className="card-title">{playlist.title}</h5>
                    <div className="w-100">
                        <Link className="btn btn-outline-secondary mt-2 w-100" to={"/playlist/" + playlist.id}>Open</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlaylistCompactCard