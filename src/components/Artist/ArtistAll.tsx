import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import AnimeSongCard from '../Card/AnimeSongCard';
import PagesType from '../../type/PagesType';

interface AnimeProps {
    songList: JsonSong[];
    pageProps: () => PagesType;
}

function ArtistAll({ songList, pageProps }: AnimeProps){
    const [componentCard, setComponentCard] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const components = [];

        const sortedSongs = [...songList].sort((a, b) => a.songName.localeCompare(b.songName));

        for (const key in sortedSongs) {
            if (sortedSongs.hasOwnProperty(key)) {
                const value = sortedSongs[key];
                components.push(<AnimeSongCard key={key} song={value} pageProps={pageProps} />);
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

export default ArtistAll