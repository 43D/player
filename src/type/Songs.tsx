type Composer = {
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
    songType: string;
    songName: string;
    songArtist: string;
    HQ: string;
    MQ: string;
    audio: string;
    composers: Composer[]

}

export default JsonSong