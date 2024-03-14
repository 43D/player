import { useEffect, useState } from "react";
import MessageCom from "../MessageCom";
import DBType from "../../type/DBType";
import PlaylistCardType from "../../type/PlaylistCardType";
import PlaylistCompactCard from "../Card/PlaylistCompactCard";
import { useNavigate } from "react-router-dom";

interface pageProps {
    dbProp: DBType;
}

function FeedPlaylist({ dbProp }: pageProps) {
    const navigate = useNavigate();

    const [component, setComponent] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const comp = <MessageCom key={987} msg="Buscando algo...." />;
        setComponent([comp]);
        getPlaylist();
    }, []);

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
            components.push(<PlaylistCompactCard key={index} playlist={playlist} />);

            if (index >= 8)
                break;
        }
        setComponent(components);
    }

    return (
        <>
            <div className="d-flex justify-content-between mb-2 mt-5">
                <h4>My Playlists</h4>
                <button className="btn btn-success" onClick={() => navigate("/playlist")}>Open Playlists</button>
            </div>
            <div className="row px-2">
                {component}
            </div>
        </>
    )
}

export default FeedPlaylist