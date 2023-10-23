import { useEffect, useRef, useState } from "react";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import PlaylistCardType from "../../type/PlaylistCardType";

type idType = {
    id: number;
    pageProps: PagesType;
    dbProp: DBType;

}

function AddPlaylistModal({ id, pageProps, dbProp }: idType) {
    const [music, setMusic] = useState<string>("" + id);
    const [anime, setAnime] = useState<string>("" + id);
    const [playlists, setPlaylists] = useState<PlaylistCardType[]>([]);
    const selectRef = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        initModal();
    }, []);

    const initModal = async () => {
        setPlaylists(await dbProp.getAllPlaylist());
        const song = await dbProp.getSongById(id);
        setMusic(song.songName);
        setAnime(song.animeJPName);
    }

    const addPlaylist = () => {
        if (selectRef.current)
            dbProp.addSongInPlaylist(Number(selectRef.current.value), id);
        
        pageProps.pages().modalClose();
    }

    return (
        <div className="modal-playlist">
            <div className="modal fade show d-block bg-trans-modal" id="add-playlist-modal" tabIndex={-1} data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="addPlaylistModalTitle" role="dialog" aria-modal="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content ">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addPlaylistModalTitle">Add playlist</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => pageProps.pages().modalClose()} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h6>Music: {music}</h6>
                            <p>Anime: {anime}</p>
                            <div className="input-group">
                                <span className="input-group-text">Playlists</span>
                                <select ref={selectRef} className="form-select form-control" aria-label="Default select example">
                                    {playlists.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.title}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-success" onClick={addPlaylist} data-bs-dismiss="modal">Add</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => pageProps.pages().modalClose()} data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPlaylistModal