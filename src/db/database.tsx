import { Key } from "react-indexed-db-hook/lib/indexed-db";
import JsonSong from "../type/Songs";
import PlaylistCardType from "../type/PlaylistCardType";
import ListenedType from "../type/ListenedType";

type dbType = (objectStore: string) => {
    add: <T = any>(value: T, key?: any) => Promise<number>;
    getByID: <T = any>(id: number | string) => Promise<T>;
    getAll: <T = any>() => Promise<T[]>;
    update: <T = any>(value: T, key?: any) => Promise<any>;
    deleteRecord: (key: Key) => Promise<any>;
    openCursor: (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>;
    getByIndex: (indexName: string, key: any) => Promise<any>;
    clear: () => Promise<any>;
}
type actionType = {
    action: (result: ListenedType[]) => void;
    range: number;
};

type pageDataType = { id: number, count: number };
type peopleType = { idPeople: number, name: string }

export const database = (db: dbType) => {
    const { add, update, getAll, openCursor, getByIndex } = db("songs");
    const addPages = db("pages").add;
    const getByIdPages = db("pages").getByID;
    const updatePages = db("pages").update;
    const addAnime = db("animes").add;
    const getByIDAnime = db("animes").getByID;
    const openCursorAnime = db("animes").openCursor;
    const addArtist = db("artists").add;
    const getByIndexArtist = db("artists").getByIndex;
    const openCursorArtist = db("artists").openCursor;
    const addComposers = db("composers").add;
    const getByIndexComposers = db("composers").getByIndex;
    const openCursorComposers = db("composers").openCursor;
    const getAllPl = db("playlists").getAll;
    const addPlaylist = db("playlists").add;
    const getByIDPl = db("playlists").getByID;
    const updatePl = db("playlists").update;
    const deletePl = db("playlists").deleteRecord;
    const getByIdListened = db("listened").getByID;
    const addListened = db("listened").add;
    const updateListened = db("listened").update;
    const contadorPage = { "id": 0, "count": 0 };
    const contadorAnime = { "id": 1, "count": 0 };
    const contadorArtist = { "id": 2, "count": 0 };
    const contadorComposer = { "id": 3, "count": 0 };

    pageInit();


    const saveAnime = (annId: number, name: string) => {
        getByIDAnime(annId).then((song) => {
            if (!song) {
                const data = {
                    annId: annId,
                    name: name
                }
                addAnime(data).then(
                    (event: number) => {
                        event = event;
                        incrementAnimePage();
                    },
                    (error: any) => {
                        error = error;
                    },
                );
            }
        });
    }

    const saveArtist = (artists: peopleType[]) => {
        artists.forEach((v) => {
            getByIndexArtist("idPeople", v.idPeople).then((people) => {
                if (!people) {
                    addArtist(v).then(
                        (event: number) => {
                            event = event;
                            incrementArtistPage();
                        },
                        (error: any) => {
                            error = error;
                        },
                    );
                }
            });
        });
    }

    const saveComposer = (composers: peopleType[]) => {
        composers.forEach((v) => {
            getByIndexComposers("idPeople", v.idPeople).then((people) => {
                if (!people) {
                    addComposers(v).then(
                        (event: number) => {
                            event = event;
                            incrementComposerPage();
                        },
                        (error: any) => {
                            error = error;
                        },
                    );
                }
            });
        });
    }

    const saveSongList = (songList: JsonSong[]) => {
        songList.forEach((v) => {
            getByIndex("annSongId", v.annSongId).then((song) => {
                if (song) {
                    const data = {
                        id: song.id,
                        annSongId: v.annSongId,
                        annId: v.annId,
                        animeENName: v.animeENName,
                        animeJPName: v.animeJPName,
                        animeVintage: v.animeVintage,
                        animeType: v.animeType,
                        songType: v.songType,
                        songName: v.songName,
                        composers: v.composers,
                        arrangers: v.arrangers,
                        artists: v.artists,
                        songArtist: v.songArtist,
                        HQ: v.HQ,
                        MQ: v.MQ,
                        audio: v.audio
                    };
                    update(data);
                } else {
                    const data = {
                        annSongId: v.annSongId,
                        annId: v.annId,
                        animeENName: v.animeENName,
                        animeJPName: v.animeJPName,
                        animeVintage: v.animeVintage,
                        animeType: v.animeType,
                        songType: v.songType,
                        songName: v.songName,
                        composers: v.composers,
                        arrangers: v.arrangers,
                        artists: v.artists,
                        songArtist: v.songArtist,
                        HQ: v.HQ,
                        MQ: v.MQ,
                        audio: v.audio
                    };
                    add(data).then(
                        (event: number) => {
                            event = event;
                            incrementPage();
                            saveAnime(data.annId, data.animeJPName);

                            const composers = getListPeople(data.composers);
                            const arrangers = getListPeople(data.arrangers);
                            const artists = getListPeople(data.artists);

                            saveComposer(composers);
                            saveComposer(arrangers);
                            saveArtist(artists);
                        },
                        (error: any) => {
                            error = error;
                        },
                    );
                }
            });


        });
    };

    const getListPeople = (elemento: any[]) => {
        const data = [] as peopleType[];
        elemento.forEach(e => {
            const el = {
                idPeople: e.id,
                name: e.names.toString()
            };
            data.push(el);
        });
        return data;
    }

    function incrementPage() {
        contadorPage.count++;
        updatePages(contadorPage);
    }

    function incrementArtistPage() {
        contadorArtist.count++;
        updatePages(contadorArtist);
    }

    function incrementComposerPage() {
        contadorComposer.count++;
        updatePages(contadorComposer);
    }

    function incrementAnimePage() {
        contadorAnime.count++;
        updatePages(contadorAnime);
    }

    function checkPages(contador: pageDataType) {
        addPages(contador).then(
            (event: number) => {
                event = event;
            },
            async (error: any) => {
                if (error.target.error.name) {
                    const result = await getPageCount(contador.id);
                    contador.count = result.count;
                }
            },
        );
    }

    function pageInit() {
        checkPages(contadorPage);
        checkPages(contadorArtist);
        checkPages(contadorComposer);
        checkPages(contadorAnime);
    }

    const getPageCount = async (id: number) => {
        return await getByIdPages(id) as pageDataType;
    }
    const getAllSongs = async () => {
        return await getAll() as JsonSong[];
    }

    const getCursor = () => {
        return openCursor;
    }

    const getCursorAnime = () => {
        return openCursorAnime;
    }

    const getCursorArtist = () => {
        return openCursorArtist;
    }

    const getCursorComposer = () => {
        return openCursorComposers;
    }

    const getAllPlaylist = async () => {
        return await getAllPl() as PlaylistCardType[];
    }

    const createPlaylist = async (name: string) => {
        const data = {
            title: name,
            songsCollections: []
        }
        await addPlaylist(data);
    }

    const getByIdPlaylist = async (id: number) => {
        return await getByIDPl(id) as PlaylistCardType;
    }


    const getCollectionSongs = async (collection: number[]) => {
        let result = [] as JsonSong[]
        for (const id of collection)
            result.push(await getByIndex("annSongId", id));
        return result;
    }

    const getSongById = async (id: number) => {
        return await getByIndex("annSongId", id) as JsonSong;
    }

    const addSongInPlaylist = async (idPlaylist: number, idSong: number) => {
        const result = await getByIdPlaylist(idPlaylist);
        if (!result.songsCollections.includes(idSong)) {
            result.songsCollections.push(idSong);
            updatePl(result);
        }
    }
    const deletePlaylist = (id: number) => {
        deletePl(id);
    }

    const addListen = async (id: number) => {
        getByIdListened(id).then((value: ListenedType) => {
            if (value) {
                value.count += 1;
                updateListened(value);
            } else {
                const result = {
                    annSongId: id,
                    count: 1
                };
                addListened(result);
            }

        });
    }
    const getTopList = ({ action, range }: actionType) => {
        const request = indexedDB.open('SuperPlayer', 10);
        const resultArray: ListenedType[] = [];

        request.onsuccess = (event: any) => {
            if (event.target.result) {
                const db = event.target.result;

                const transaction = db.transaction('listened', 'readonly');
                const objectStore = transaction.objectStore('listened');
                const index = objectStore.index('count');

                const cursorRequest = index.openCursor(null, 'prev'); // 'prev' para obter em ordem decrescente.

                let count = 0;
                cursorRequest.onsuccess = (event: any) => {
                    if (event.target.result) {
                        const cursor = event.target.result;

                        if (cursor && count < range) {
                            resultArray.push(cursor.value);
                            count++;
                            cursor.continue();
                        } else {
                            action(resultArray);
                        }
                    } else {
                        action(resultArray);
                    }
                };

            };
        }
    }

    return {
        saveSongList,
        getAllSongs,
        getPageCount,
        getCursor,
        getCursorAnime,
        getCursorArtist,
        getCursorComposer,
        getAllPlaylist,
        createPlaylist,
        getByIdPlaylist,
        getCollectionSongs,
        getSongById,
        addSongInPlaylist,
        deletePlaylist,
        addListen,
        getTopList
    }
}