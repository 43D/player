import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import AnimeCard from '../AnimeCard';
import PagesType from '../../type/PagesType';

interface AnimeProps {
    songList: JsonSong[];
    pageProps: PagesType;
}

function SearchArtist({ songList, pageProps }: AnimeProps) {
    const [componentCard, setComponentCard] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const components = [];

        for (const key in songList) {
            if (songList.hasOwnProperty(key)) {
                const value = songList[key];
                components.push(<AnimeCard key={key} song={value} pageProps={pageProps} />);
            }
        }

        setComponentCard(components);
    }, [songList]);

    return (
        <div>
            <h4 className="my-2" style={{ cursor: 'pointer' }} onClick={() => pageProps.pages().getArtist(songList[0].artists[0].id)}> {songList[0].artists[0].names.toString()}</h4>
            <ul className="list-group">
                {componentCard}
            </ul>
        </div>
    );
}

export default SearchArtist