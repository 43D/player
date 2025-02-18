import { useEffect, useState } from 'react';
import JsonSong from '../../type/Songs';
import AnimeSongCard from '../Card/AnimeSongCard';
import PagesType from '../../type/PagesType';

interface AnimeProps {
    songList: JsonSong[];
    pageProps: () => PagesType;
}

function AnimeType({ songList, pageProps }: AnimeProps) {
    const [componentCardOpening, setComponentCardOpening] = useState<React.JSX.Element[]>([]);
    const [componentCardEnding, setComponentCardEnding] = useState<React.JSX.Element[]>([]);
    const [componentCardInsert, setComponentCardInsert] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        const componentsOpening = [];
        const componentsEnding = [];
        const componentsInsert = [];

        for (const key in songList) {
            if (songList.hasOwnProperty(key)) {
                const value = songList[key];
                if (value.songType.toLowerCase().includes("opening"))
                    componentsOpening.push(<AnimeSongCard key={key} song={value} pageProps={pageProps} />);
                else if (value.songType.toLowerCase().includes("ending"))
                    componentsEnding.push(<AnimeSongCard key={key} song={value} pageProps={pageProps} />);
                else
                    componentsInsert.push(<AnimeSongCard key={key} song={value} pageProps={pageProps} />);
            }
        }

        setComponentCardOpening(componentsOpening);
        setComponentCardEnding(componentsEnding);
        setComponentCardInsert(componentsInsert);
    }, [songList]);

    return (
        <div>
            {componentCardOpening.length > 0 && <>
                <h4>Opening</h4>
                <ul className="list-group mb-4">
                    {componentCardOpening}
                </ul>
            </>}
            {componentCardEnding.length > 0 && <>
                <h4>Ending</h4>
                <ul className="list-group mb-4">
                    {componentCardEnding}
                </ul>
            </>}
            {componentCardInsert.length > 0 && <>
                <h4>Insert Song</h4>
                <ul className="list-group mb-4">
                    {componentCardInsert}
                </ul>
            </>}
        </div>
    );
}

export default AnimeType