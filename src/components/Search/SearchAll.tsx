import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import SearchCard from './SearchCard';

interface AnimeProps {
    songList: JsonSong[];
}

function SearchAll({ songList }: AnimeProps){
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
            <ul className="list-group">
                {componentCard}
            </ul>
        </div>
    );
}

export default SearchAll