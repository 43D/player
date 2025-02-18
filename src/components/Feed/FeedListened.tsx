import { useEffect, useRef, useState } from "react";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import DBType from "../../type/DBType";
import ListenedType from "../../type/ListenedType";
import AnimeSongListenedCard from "../Card/AnimeSongListenedCard";
import { useNavigate } from "react-router-dom";

interface pageProps {
    pageProps: () => PagesType;
    dbProp: DBType;
}

function FeedListened({ pageProps, dbProp }: pageProps) {
    const navigate = useNavigate();

    const [component, setComponent] = useState<React.JSX.Element[]>([]);
    const feedDiscovery = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const comp = <MessageCom key={987} msg="Buscando algo...." />;
        setComponent([comp]);
        getListened();
    }, []);

    const getListened = () => {
        const range = 10;
        dbProp.getTopList({ action, range });
    }
    const action = async (result: ListenedType[]) => {
        if (result.length === 0)
            setComponent([<MessageCom key={"978"} msg="No music listened to…" />])
        else {
            const components: React.JSX.Element[] = [];
            for (const list of result) {
                const song = await dbProp.getSongById(list.annSongId);
                components.push(<AnimeSongListenedCard key={list.annSongId} count={list.count} song={song} pageProps={pageProps} />);
            }
            setComponent(components);
        }

    }

    return (
        <div className="col-12 mt-5" ref={feedDiscovery}>
            <div className="d-flex justify-content-between mb-2">
                <h4>Most Listened (Top 10)</h4>
                <button className="btn btn-success" onClick={() => navigate("/listened")}>Open Most Listened</button>
            </div>
            <ul className="list-group">
                {component}
            </ul>
        </div>
    )
}

export default FeedListened