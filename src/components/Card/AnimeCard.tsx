import AnimeCardType from "../../type/AnimeCardType";
import { Link } from "react-router-dom";

interface CardProps {
    anime: AnimeCardType;
}

function AnimeCard({ anime }: CardProps) {

    return (
        <div className="card col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="card-body">
                <h5 className="card-title">{anime.name}</h5>
                <div className="w-100 d-flex justify-content-center">
                    <Link className="btn btn-outline-success mt-2" to={"/anime/" + anime.annId}>Open Anime</Link>
                </div>
            </div>
        </div>
    );
}

export default AnimeCard