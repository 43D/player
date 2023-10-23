import { useEffect, useRef, useState } from "react";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import PlaylistCard from "../Card/PlaylistCard";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
}

function HomePlaylist({ pageProps, dbProp }: pageProps) {
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setComponent([<MessageCom key={"512"} msg="Pesquisando playlist, aguarde...." />])
        getAllPlaylist();
    }, []);

    async function getAllPlaylist() {
        const result = await dbProp.getAllPlaylist();

        const comp = [] as JSX.Element[];
        result.forEach((v) => {
            comp.push(<PlaylistCard key={v.id} pageProps={pageProps} playlist={v} />)
        });
        setComponent(comp);
    }

    const createPlaylist = () => {
        if (inputRef.current) {
            const name = inputRef.current.value;
            dbProp.createPlaylist(name);
            getAllPlaylist();
        }
    }

    return (
        <div className="row justify-content-center mt-3">
            <div className="row">
                <div className="card card-playlist col-12 col-md-6 col-lg-4 col-xl-3">
                    <div className="card-body">
                        <h5 className="card-title text-center">Create a Playlist</h5>
                        <div className="d-flex justify-content-center">
                            <i className="bi bi-plus bi-plus-custom"></i>
                        </div>
                        <div className="w-100 d-flex justify-content-center">
                            <a href="#" className="btn btn-outline-success mt-2" data-bs-toggle="modal" data-bs-target="#playlistModal">Create Playlist</a>
                        </div>
                    </div>
                </div>
                {component}
                <div className="modal-playlist">
                    <div className="modal fade" id="playlistModal" tabIndex={-1} aria-labelledby="playlistModalTitle" aria-hidden="true">
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content ">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="playlistModalTitle">Create Playlist</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="input-group">
                                        <span className="input-group-text">Name</span>
                                        <input ref={inputRef} type="text" className="form-control" aria-label="Name of Playlist"></input>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-outline-success" onClick={createPlaylist} data-bs-dismiss="modal">Create</button>
                                    <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePlaylist