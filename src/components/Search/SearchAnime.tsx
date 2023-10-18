import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import SearchCard from './SearchCard';
import PagesType from '../../type/PagesType';

interface AnimeProps {
    songList: JsonSong[];
    pageProps: PagesType;
}

function SearchAnime({ songList, pageProps }: AnimeProps){
    const [componentCard, setComponentCard] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const components = [];

        for (const key in songList) {
            if (songList.hasOwnProperty(key)) {
                const value = songList[key];
                components.push(<SearchCard key={key} song={value} pageProps={pageProps} />);
            }
        }

        setComponentCard(components);
    }, [songList]);

    return (
        <div>
            <h4 className="my-2">{songList[0].animeENName}</h4>
            <ul className="list-group">
                {componentCard}
            </ul>
        </div>
    );
}
export default SearchAnime