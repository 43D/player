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
    const [componentCard, setComponentCard] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const components = [];

        for (const key in songList) {
            if (songList.hasOwnProperty(key)) {
                const value = songList[key];
                (playlist)? components.push(<AnimeSongPlaylistCard key={key} idPlaylist={idPlaylist} observer={observer} song={value} pageProps={pageProps} />): components.push(<AnimeSongCard key={key} song={value} pageProps={pageProps} />);
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