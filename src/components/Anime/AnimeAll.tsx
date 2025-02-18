import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import AnimeSongCard from '../Card/AnimeSongCard';
import PagesType from '../../type/PagesType';
import AnimeSongPlaylistCard from '../Card/AnimeSongPlaylistCard';

interface AnimeProps {
    songList: JsonSong[];
    pageProps: () => PagesType;
    playlist?: boolean;
    idPlaylist?: number;
    observer?: any
}

function AnimeAll({ songList, pageProps, playlist = false, idPlaylist = 0, observer }: AnimeProps) {
    const [componentCard, setComponentCard] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const components = [];
        let sortedSongs = songList;
        if (idPlaylist === 0)
            sortedSongs = [...songList].sort((a, b) => a.songName.localeCompare(b.songName));

        for (const key in sortedSongs) {
            if (sortedSongs.hasOwnProperty(key)) {
                const value = sortedSongs[key];
                (playlist) ? components.push(<AnimeSongPlaylistCard key={key} idPlaylist={idPlaylist} observer={observer} song={value} pageProps={pageProps} />) : components.push(<AnimeSongCard key={key} song={value} pageProps={pageProps} />);
            }
        }

        setComponentCard(components);
    }, [songList]);

    return (
        <div>
            <ul className="list-group">
                {componentCard}
            </ul>
        </div>
    );
}

export default AnimeAll