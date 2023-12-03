import { useEffect, useRef, useState } from "react";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import DBType from "../../type/DBType";
import { feacthAniSong } from "../../services/feacthAniSong";
import JsonSong from "../../type/Songs";
import SearchAll from "../Search/SearchAll";

interface pageProps {
    pageProps:() =>  PagesType;
    dbProp: DBType;
}

function FeedDiscovery({ pageProps, dbProp }: pageProps) {
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [nameBtn, setNameBtn] = useState<string>("Show more...");
    const feedDiscovery = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const comp = <MessageCom key={987} msg="Buscando algo...." />;
        setComponent([comp]);
        getRandomAnime();
    }, []);

    const getRandomAnime = async () => {
        const result = await feacthAniSong().fetchRandomAnime();
        createAll(result);
        dbProp.saveSongList(result);
    }

    const createAll = (song: JsonSong[]) => {
        const components: JSX.Element[] = [];
        if (song) {
            if (song.length === 0)
                components.push(<MessageCom key={"2"} msg="Nada foi encontrado nada..." />)
            else
                components.push(<SearchAll key={"3"} songList={song} pageProps={pageProps} />);
        }
        setComponent(components);
    };

    const showMoreFeed = () => {
        setNameBtn("Show more...");
        if (feedDiscovery.current) {
            const style = (feedDiscovery.current.style.maxHeight == 'none') ? "240px" : "none";
            feedDiscovery.current.style.maxHeight = style;
            if (style == "none")
                setNameBtn("Show less...");
        }
    }

    return (
        <div className="col-12 feed-component" ref={feedDiscovery}>
            <div className="d-flex justify-content-between mb-2">
                <h2>Discovery</h2>
                <button className="btn btn-success" onClick={showMoreFeed}>{nameBtn}</button>
            </div>
            {component}
        </div>
    )
}

export default FeedDiscovery