import JsonSong from "../type/Songs";

export const database = (add: any) => {
    const saveSongList = (songList: JsonSong[]) => {
        songList.forEach((v) => {
            const data = {
                annSongId: v.annSongId,
                annId: v.annId,
                animeENName: v.animeENName,
                animeJPName: v.animeJPName,
                animeVintage: v.animeVintage,
                animeType: v.animeType,
                songType: v.songType,
                songName: v.songName,
                songArtist: v.songArtist,
                HQ: v.HQ,
                MQ: v.MQ,
                audio: v.audio,
                composers: v.composers
            };

            add(data).then(
                (event: number) => {
                    event = event;
                },
                (error: any) => {
                    error = error;
                },
            );
        });

    };

    return {
        saveSongList
    }

}