import { useEffect, useRef, useState } from "react";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import HomePagesType from "../../type/HomePagesType";
import DBType from "../../type/DBType";
import PlaylistCardType from "../../type/PlaylistCardType";
import PlaylistCompactCard from "../Card/PlaylistCompactCard";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
    homePages: HomePagesType;
}

function FeedPlaylist({ pageProps, dbProp, homePages }: pageProps) {
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const feedDiscovery = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const comp = <MessageCom key={987} msg="Buscando algo...." />;
        setComponent([comp]);
        getPlaylist();
    }, []);

    const showMoreFeed = () => {
        homePages().createPlaylistction();
    }

    const getPlaylist = async () => {
        const result = await dbProp.getAllPlaylist();
        if (result.length === 0)
            setComponent([<MessageCom key={"978"} msg="No playlist created…" />])
        else
            createPlaylist(result);

    }

    const shuffleArray = (array: PlaylistCardType[]) => {
        const shuffledArray = array.slice();
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    const createPlaylist = (result: PlaylistCardType[]) => {
        const playlists = shuffleArray(result);
        const components: JSX.Element[] = [];
        for (let index = 0; index < playlists.length; index++) {
            const playlist = playlists[index];
            components.push(<PlaylistCompactCard key={index} pageProps={pageProps} playlist={playlist} />);

            if (index >= 11)
                break;
        }
        setComponent(components);
    }

    return (
        <div className="col-12 mt-5" ref={feedDiscovery}>
            <div className="d-flex justify-content-between mb-2">
                <h4>My Playlists</h4>
                <button className="btn btn-success" onClick={showMoreFeed}>Open Playlists</button>
            </div>

            <div className="row">
                {component}
            </div>
        </div>
    )
}

export default FeedPlaylist