import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import AnimeSongCard from '../AnimeSongCard';
import PagesType from '../../type/PagesType';

interface AnimeProps {
    songList: JsonSong[];
    pageProps: PagesType;
}

function ArtistAnime({ songList, pageProps }: AnimeProps){
    const [componentCard, setComponentCard] = useState<JSX.Element[]>([]);

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
            <h4 className="my-2" style={{ cursor: 'pointer' }} onClick={() => pageProps.pages().getAnime(songList[0].annId)}>{songList[0].animeJPName}</h4>
            <ul className="list-group">
                {componentCard}
            </ul>
        </div>
    );
}

export default ArtistAnime