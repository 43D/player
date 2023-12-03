import { useEffect, useState } from "react";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";

type idType = {
    id: number;
    pageProps: () => PagesType;
    dbProp: DBType;

}

function DeletePlaylistModal({ id, pageProps, dbProp }: idType) {
    const [name, setName] = useState<string>("" + id);

    useEffect(() => {
        initModal();
    }, []);

    const initModal = async () => {
        setName((await dbProp.getByIdPlaylist(id)).title);
    }

    const deletePlaylist = () => {
        dbProp.deletePlaylist(id);
        pageProps().modalClose();
        location.reload();
    }

    return (
        <div className="modal-playlist">
            <div className="modal fade show d-block bg-trans-modal" id="add-playlist-modal" tabIndex={-1} data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="addPlaylistModalTitle" role="dialog" aria-modal="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content ">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="addPlaylistModalTitle">Delete playlist</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={() => pageProps().modalClose()} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p>Delete this: {name}</p>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-danger" onClick={deletePlaylist} data-bs-dismiss="modal">Delete</button>
                            <button type="button" className="btn btn-outline-secondary" onClick={() => pageProps().modalClose()} data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DeletePlaylistModal