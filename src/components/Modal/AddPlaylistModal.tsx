import { useEffect, useRef, useState } from "react";
import DBType from "../../type/DBType";
import PlaylistCardType from "../../type/PlaylistCardType";

declare var bootstrap: any;

type idType = {
    id: number;
    observer: number;
    dbProp: DBType;

}

function AddPlaylistModal({ id, observer, dbProp }: idType) {
    const [music, setMusic] = useState<string>("" + id);
    const [anime, setAnime] = useState<string>("" + id);
    const [playlists, setPlaylists] = useState<PlaylistCardType[]>([]);
    const selectRef = useRef<HTMLSelectElement>(null);
    const [modalPlayList, setModalPlayList] = useState<any | null>(null);

    useEffect(() => {
        if (modalPlayList == null) {
            const modalElement = document.getElementById('add-playlist-modal');
            var myModal = new bootstrap.Modal(modalElement, {});
            setModalPlayList(myModal);
        }

    }, []);

    useEffect(() => {
        if (id > 0) {

            if (modalPlayList == null) {
                const modalElement = document.getElementById('add-playlist-modal');
                var myModal = new bootstrap.Modal(modalElement, {});
                setModalPlayList(myModal);
                myModal.show();
            } else
                modalPlayList.show();

            initModal();
        }

    }, [observer]);

    const initModal = async () => {
        setPlaylists(await dbProp.getAllPlaylist());
        const song = await dbProp.getSongById(id);
        setMusic(song.songName);
        setAnime(song.animeJPName);
    }

    const addPlaylist = () => {
        if (selectRef.current)
            dbProp.addSongInPlaylist(Number(selectRef.current.value), id);

        close();
    }

    const close = () => {
        modalPlayList.hide();
        document.getElementsByClassName("modal-backdrop fade show")[0].remove();
    }

    return (
        <div className="modal-playlist">
            <div className="modal fade" id="add-playlist-modal" tabIndex={-1} aria-labelledby="addPlaylistModalTitle">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content ">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addPlaylistModalTitle">Add playlist</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={close} aria-label="Close"></button>
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
                            <button type="button" className="btn btn-outline-secondary" onClick={close} data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddPlaylistModal