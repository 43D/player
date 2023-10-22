import PagesType from "../../type/PagesType";
import AnimeCardType from "../../type/AnimeCardType";

interface CardProps {
    anime: AnimeCardType;
    pageProps: PagesType;
}

function AnimeCard({ anime, pageProps }: CardProps) {

    return (
        <div className="card col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="card-body">
                <h5 className="card-title">{anime.name}</h5>
                <div className="w-100 d-flex justify-content-center">
                    <a href="#" onClick={() => pageProps.pages().getAnime(anime.annId)} className="btn btn-outline-success mt-2">Open Anime</a>
                </div>
            </div>
        </div>
    );
}

export default AnimeCard