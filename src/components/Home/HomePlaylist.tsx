import { ChangeEvent, useEffect, useRef, useState } from "react";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import PlaylistCard from "../Card/PlaylistCard";
import PlaylistCardType from "../../type/PlaylistCardType";
import JsonSong from "../../type/Songs";

interface pageProps {
    pageProps: () => PagesType;
    dbProp: DBType;
}

type jsonImport = {
    playlist: PlaylistCardType;
    songs: JsonSong[];
}

function HomePlaylist({ pageProps, dbProp }: pageProps) {
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const [dataImport, setDataImport] = useState<jsonImport | null>(null);
    const [selectedOption, setSelectedOption] = useState<string>('create');
    const [allPlaylist, setAllPlaylist] = useState<PlaylistCardType[]>([]);
    const [showBtnClose, setShowBtnClose] = useState<boolean>(true);

    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedOption(event.target.value);
    };

    useEffect(() => {
        setComponent([<MessageCom key={"512"} msg="Pesquisando playlist, aguarde...." />])
        getAllPlaylist();
    }, []);

    async function getAllPlaylist() {
        const result = await dbProp.getAllPlaylist();
        setAllPlaylist(result);

        const comp = [] as JSX.Element[];
        result.forEach((v) => {
            comp.push(<PlaylistCard key={v.id} pageProps={pageProps} playlist={v} />)
        });
        setComponent(comp);
    }

    const createPlaylist = () => {
        if (inputRef.current) {
            const name = inputRef.current.value;
            createPlaylistByName(name);
        }
    }

    const createPlaylistByName = async (name: string) => {
        dbProp.createPlaylist(name);
        await getAllPlaylist();
    }

    const isValidJsonImport = (obj: any): obj is jsonImport => {
        return obj && obj.playlist && Array.isArray(obj.songs);
    };


    const onChangeImportJson = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result;
                if (typeof result === 'string') {
                    const jsonData: jsonImport = JSON.parse(result);
                    if (isValidJsonImport(jsonData))
                        setDataImport(jsonData);
                    else
                        setDataImport(null);

                } else
                    setDataImport(null);
            };
            reader.readAsText(file);
        } else
            setDataImport(null);
    }

    const importSongsFromJson = () => {
        if (dataImport) {
            console.log(selectedOption, dataImport);
            setShowBtnClose(false);
            switch (selectedOption) {
                case "create":
                    createAnyaway();
                    break;
                case "mix":
                    mixPlaylist();
                    break;
                case "replace":
                    replacePlaylist();
                    break;
                default:
                    createAnyaway();
                    break;
            }
        }
    }

    const createAnyaway = async () => {
        let name = dataImport?.playlist.title as string;

        for (let i = 0; i < allPlaylist.length; i++) {
            if (allPlaylist[i].title === name) {
                const d = new Date();
                name += " " + d.toLocaleDateString() + " " + d.toLocaleTimeString();
                break;
            }
        }

        await createPlaylistByName(name);
        const result = await dbProp.getAllPlaylist();
        const id = result[result.length - 1].id;
        const songs = dataImport?.songs as JsonSong[]

        await dbProp.saveSongList(songs);
        for (let i = 0; i < songs.length; i++)
            await dbProp.addSongInPlaylist(id, songs[i].annSongId);

        await getAllPlaylist();
        setShowBtnClose(true);
    }

    const mixPlaylist = async () => {
        let id = -1;

        for (let i = 0; i < allPlaylist.length; i++) {
            if (allPlaylist[i].title === dataImport?.playlist.title) {
                id = allPlaylist[i].id;
                break;
            }
        }

        const songs = dataImport?.songs as JsonSong[]
        await dbProp.saveSongList(songs);

        if (id != -1)
            for (let i = 0; i < songs.length; i++)
                await dbProp.addSongInPlaylist(id, songs[i].annSongId);
        else {
            await createPlaylistByName(dataImport?.playlist.title as string);
            const result = await dbProp.getAllPlaylist();
            const id_playlist = result[result.length - 1].id;

            for (let i = 0; i < songs.length; i++)
                await dbProp.addSongInPlaylist(id_playlist, songs[i].annSongId);
        }

        await getAllPlaylist();
        setShowBtnClose(true);
    }

    const replacePlaylist = async () => {
        let id = -1;

        for (let i = 0; i < allPlaylist.length; i++) {
            if (allPlaylist[i].title === dataImport?.playlist.title) {
                id = allPlaylist[i].id;
                break;
            }
        }

        const songs = dataImport?.songs as JsonSong[]
        await dbProp.saveSongList(songs);

        if (id != -1)
            await dbProp.deletePlaylist(id);

        await createPlaylistByName(dataImport?.playlist.title as string);
        const result = await dbProp.getAllPlaylist();
        const id_playlist = result[result.length - 1].id;

        for (let i = 0; i < songs.length; i++)
            await dbProp.addSongInPlaylist(id_playlist, songs[i].annSongId);

        await getAllPlaylist();
        setShowBtnClose(true);
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
                            <a href="#" className="btn btn-outline-secondary mt-2 ms-1" data-bs-toggle="modal" data-bs-target="#importModal">Import playlist</a>
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
                    <div className="modal fade" id="importModal" tabIndex={-1} aria-labelledby="importModalTitle" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false" >
                        <div className="modal-dialog modal-lg">
                            <div className="modal-content ">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="importModalTitle">Import Playlist</h1>
                                    {showBtnClose &&
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    }
                                </div>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <input className="form-control" type="file" accept=".json" onChange={onChangeImportJson} id="formFile" />
                                    </div>
                                    <div>
                                        <h5>In case of playlist name conflict:</h5>
                                    </div>
                                    <div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" onChange={handleOptionChange} type="radio" name="importOptionRadio" id="inlineRadio3" value="create" defaultChecked />
                                            <label className="form-check-label" htmlFor="inlineRadio3">Create under another name</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" onChange={handleOptionChange} type="radio" name="importOptionRadio" id="inlineRadio2" value="mix" />
                                            <label className="form-check-label" htmlFor="inlineRadio2">Mix</label>
                                        </div>
                                        <div className="form-check form-check-inline">
                                            <input className="form-check-input" onChange={handleOptionChange} type="radio" name="importOptionRadio" id="inlineRadio1" value="replace" />
                                            <label className="form-check-label" htmlFor="inlineRadio1">Replace everything</label>
                                        </div>
                                    </div>
                                    {dataImport &&
                                        <div>
                                            <hr />
                                            <h5>{dataImport.playlist.title}</h5>
                                            <p>{dataImport.songs.length} songs</p>
                                        </div>
                                    }
                                    {!showBtnClose &&
                                        <div className="spinner-border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    }
                                </div>
                                <div className="modal-footer">
                                    {(dataImport && showBtnClose) &&
                                        <button type="button" onClick={importSongsFromJson} className="btn btn-outline-success">Import</button>
                                    }
                                    {showBtnClose &&
                                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                                    }
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