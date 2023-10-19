import JsonSong from "../type/Songs";

type addType = <T = any>(value: T, key?: any) => Promise<number>;
type updateType = <T = any>(value: T, key?: any) => Promise<any>;

export const database = (add: addType, update: updateType) => {
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
                },
                (error: any) => {
                    // put não exite, o que é triste
                    if (error.target.error.name)
                        update(data);
                },
            );
        });

    };

    return {
        saveSongList
    }

}