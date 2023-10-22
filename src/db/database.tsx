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

export const database = (db: dbType) => {
    const { add, update, getAll, getByID, openCursor, getByIndex } = db("songs");
    const addPages = db("pages").add;
    const getByIdPages = db("pages").getByID;
    const updatePages = db("pages").update;
    const contador = { "id": 0, "count": 0 };
    pageInit();

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
                        },
                        (error: any) => {
                            error = error;
                        },
                    );
                }
            });


        });
    };

    async function incrementPage() {
        contador.count++;
        updatePages(contador);
    }

    function pageInit() {
        addPages(contador).then(
            (event: number) => {
                event = event;
            },
            async (error: any) => {
                if (error.target.error.name) {
                    const result = await getPageCount();
                    contador.count = result.count;
                }
            },
        );
    }

    const getPageCount = async () => {
        return await getByIdPages(0) as pageDataType;
    }
    const getAllSongs = async () => {
        return await getAll() as JsonSong[];
    }

    const getCursor = () => {
        return openCursor;
    }

    return {
        saveSongList,
        getAllSongs,
        getPageCount,
        getCursor
    }

}