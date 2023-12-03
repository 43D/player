import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import AnimeSongCard from '../Card/AnimeSongCard';
import PagesType from '../../type/PagesType';
import { useNavigate } from 'react-router-dom';

interface AnimeProps {
    songList: JsonSong[];
    pageProps: () => PagesType;
}

function SearchArtist({ songList, pageProps }: AnimeProps) {
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

    const nav = () => {
        const idNav = (songList[0].artists[0]) ? songList[0].artists[0].id : "0";
        navigate("/artist/" + idNav);
    }

    return (
        <div>
            <h4 className="my-2" style={{ cursor: 'pointer' }} onClick={nav}> {(songList[0].artists[0]) ? songList[0].artists[0].names.toString() : "???????"}</h4>
            <ul className="list-group">
                {componentCard}
            </ul>
        </div>
    );
}

export default SearchArtist