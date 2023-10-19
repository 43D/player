type Composer = {
    id: number;
    names: string[];
}

type Artist = {
    id: number;
    names: string[];
    members: Composer[];
}

type Arranger = {
    id: number;
    names: string[];
}

type JsonSong = {
    annId: number;
    annSongId: number;
    animeENName: string;
    animeJPName: string;
    animeVintage: string;
    animeType: string;
    artists: Artist[];
    songType: string;
    songName: string;
    songArtist: string;
    HQ: string;
    MQ: string;
    audio: string;
    composers: Composer[];
    arrangers: Arranger[];
}

export default JsonSong