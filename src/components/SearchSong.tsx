import { useEffect, useState } from 'react';
import JsonSong from '../type/Songs';
import SearchCard from './SearchCard';

interface AnimeProps {
    songList: JsonSong[];
}

function SearchSong({ songList }: AnimeProps){
    const [componentCard, setComponentCard] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const components = [];

        for (const key in songList) {
            if (songList.hasOwnProperty(key)) {
                const value = songList[key];
                components.push(<SearchCard key={key} song={value} />);
            }
        }

        setComponentCard(components);
    }, [songList]);

    return (
        <div>
            <h4 className="my-2">{songList[0].songName.charAt(0).toUpperCase()}</h4>
            <ul className="list-group">
                {componentCard}
            </ul>
        </div>
    );
}

export default SearchSong