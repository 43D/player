import ListenedType from "./ListenedType";
import PlaylistCardType from "./PlaylistCardType";
import JsonSong from "./Songs";

type pageDataType = { id: number, count: number };

type curso = (cursorCallback: (event: Event) => void, keyRange?: IDBKeyRange) => Promise<void>;

type actionType = {
    action: (result: ListenedType[]) => void;
    range: number;
};

type DBType = {
    saveSongList: (songList: JsonSong[]) => Promise<void>;
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
    addSongInPlaylist: (idPlaylist: number, idSong: number) => Promise<void>;
    deletePlaylist: (id: number) => Promise<void>;
    addListen: (id: number) => Promise<void>;
    getTopList: ({ action, range }: actionType) => void;
}

export default DBType