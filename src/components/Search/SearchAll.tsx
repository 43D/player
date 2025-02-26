import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import AnimeSongCard from '../Card/AnimeSongCard';
import PagesType from '../../type/PagesType';

interface AnimeProps {
    songList: JsonSong[];
    pageProps: () => PagesType;
}

function SearchAll({ songList, pageProps }: AnimeProps){
    const [componentCard, setComponentCard] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const components = [];

        for (const key in songList) {
            if (songList.hasOwnProperty(key)) {
                const value = songList[key];
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

export default SearchAll