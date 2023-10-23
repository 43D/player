import PlaylistCardType from "./PlaylistCardType";
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
    getAllPlaylist: () => Promise<PlaylistCardType[]>;
    createPlaylist: (name: string) => void;
    getByIdPlaylist: (id: number) => Promise<PlaylistCardType>;
    getCollectionSongs: (collection: number[]) => Promise<JsonSong[]>;
    getSongById: (id: number) => Promise<JsonSong>;
    addSongInPlaylist: (idPlaylist: number, idSong: number) => void;
    deletePlaylist: (id: number) => void;
}

export default DBType