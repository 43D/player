import PagesType from "../../type/PagesType";
import PlaylistCardType from "../../type/PlaylistCardType";

interface CardProps {
    playlist: PlaylistCardType;
    pageProps: PagesType;
}

function PlaylistCard({ playlist, pageProps }: CardProps) {

    return (
        <div className="card col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="card-body">
                <h5 className="card-title text-center">{playlist.title}</h5>
                <p className="text-center">0 songs</p>
                <div className="w-100 d-flex justify-content-center">
                    <a href="#" className="btn btn-outline-success mt-2">Open PlayList</a>
                </div>
            </div>
        </div>
    );
}

export default PlaylistCard