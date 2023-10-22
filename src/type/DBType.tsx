import JsonSong from "./Songs";

type pageDataType = { id: number, count: number };

type DBType = {
    saveSongList: (songList: JsonSong[]) => void;
    getAllSongs: () => Promise<JsonSong[]>;
    getPageCount: () => Promise<pageDataType>;
    getCursor: () => (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>;
}

export default DBType