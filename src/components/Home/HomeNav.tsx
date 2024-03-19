import { useLocation, useNavigate } from "react-router-dom";

function HomeNav() {
    const localizacao = useLocation();
    const navigate = useNavigate();

    const getClassName = (path: string) => {
        if (path === localizacao.pathname.split("/")[1])
            return "btn btn-success m-1"
        else
            return "btn btn-outline-secondary m-1"
    }

    return (
        <div className="col-12 mt-2 mb-4">
            <button onClick={() => navigate("/")} className={getClassName("")}>Home</button>
            <button onClick={() => navigate("/playlist")} className={getClassName("playlist")}>Playlist</button>
            <button onClick={() => navigate("/listened")} className={getClassName("listened")}>Most listened</button>
            <button onClick={() => navigate("/song")} className={getClassName("song")}>My songs</button>
            <button onClick={() => navigate("/season")} className={getClassName("season")}>Season Seletor</button>
            <button onClick={() => navigate("/anime")} className={getClassName("anime")}>Animes</button>
            <button onClick={() => navigate("/artist")} className={getClassName("artist")}>Artists</button>
            <button onClick={() => navigate("/creator")} className={getClassName("creator")}>Composers/Arrangers</button>
        </div>
    );
}

export default HomeNav