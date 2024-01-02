import { useEffect, useState } from "react";
import DBType from "../../type/DBType";

declare var bootstrap: any;

type idType = {
    id: number;
    observer: number;
    dbProp: DBType;
}

function DeletePlaylistModal({ id, observer, dbProp }: idType) {
    const [name, setName] = useState<string>("" + id);
    const [modalPlayList, setModalPlayList] = useState<any | null>(null);

    useEffect(() => {
        if (modalPlayList == null) {
            const modalElement = document.getElementById('delete-playlist-modal');
            var myModal = new bootstrap.Modal(modalElement, {});
            setModalPlayList(myModal);
        }
    }, []);


    useEffect(() => {
        if (id > 0) {
            if (modalPlayList == null) {
                const modalElement = document.getElementById('delete-playlist-modal');
                var myModal = new bootstrap.Modal(modalElement, {});
                setModalPlayList(myModal);
                myModal.show();
            } else {
                modalPlayList.show();
            }

            initModal();
        }
    }, [observer]);

    const initModal = async () => {
        setName((await dbProp.getByIdPlaylist(id)).title);
    }

    const deletePlaylist = () => {
        dbProp.deletePlaylist(id);
        modalClose();
        location.reload();
    }

    const modalClose = () => {
        modalPlayList.hide();
        document.getElementsByClassName("modal-backdrop fade show")[0].remove();
    }

    return (
        <div className="modal-playlist">
            <div className="modal fade" id="delete-playlist-modal" tabIndex={-1} aria-labelledby="deletePlaylistModalTitle">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content ">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="deletePlaylistModalTitle">Delete playlist</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={modalClose} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Delete this: {name}</p>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={deletePlaylist} data-bs-dismiss="modal">Delete</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={modalClose} data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeletePlaylistModal