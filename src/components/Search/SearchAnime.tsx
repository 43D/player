import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import AnimeSongCard from '../Card/AnimeSongCard';
import PagesType from '../../type/PagesType';
import { useNavigate } from 'react-router-dom';

interface AnimeProps {
    songList: JsonSong[];
    pageProps: () => PagesType;
}

function SearchAnime({ songList, pageProps }: AnimeProps){
    const [componentCard, setComponentCard] = useState<JSX.Element[]>([]);
    const navigate = useNavigate();

    
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
            <h4 className="my-2" style={{ cursor: 'pointer' }} onClick={() =>  navigate("/anime/" + songList[0].annId)}>{songList[0].animeJPName}</h4>
            <ul className="list-group">
                {componentCard}
            </ul>
        </div>
    );
}
export default SearchAnime