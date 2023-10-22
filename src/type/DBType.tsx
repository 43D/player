import JsonSong from "./Songs";

type pageDataType = { id: number, count: number };

type curso = (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>;
type DBType = {
    saveSongList: (songList: JsonSong[]) => void;
    getAllSongs: () => Promise<JsonSong[]>;
    getPageCount: (id: number) => Promise<pageDataType>;
    getCursor: () => curso;
    getCursorAnime: () => curso;
    getCursorArtist: () => curso;
    getCursorComposer: () => curso;
}

export default DBType