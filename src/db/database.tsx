import { Key } from "react-indexed-db-hook/lib/indexed-db";
import JsonSong from "../type/Songs";

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

    return {
        saveSongList,
        getAllSongs,
        getPageCount,
        getCursor,
        getCursorAnime,
        getCursorArtist,
        getCursorComposer
    }

}