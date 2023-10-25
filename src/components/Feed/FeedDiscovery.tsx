import { useEffect, useRef, useState } from "react";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import DBType from "../../type/DBType";
import { feacthAniSong } from "../../services/feacthAniSong";
import JsonSong from "../../type/Songs";
import SearchAll from "../Search/SearchAll";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
}

function FeedDiscovery({ pageProps, dbProp }: pageProps) {
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [nameBtn, setNameBtn] = useState<string>("more");
    const feedDiscovery = useRef<HTMLDivElement>(null);
    const divMore = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const comp = <MessageCom key={987} msg="Buscando algo...." />;
        setComponent([comp]);
        getRandomAnime();
    }, []);

    useEffect(() => {
        if (feedDiscovery.current && divMore.current)
            divMore.current.style.height = (feedDiscovery.current.clientHeight + 20) + "px";
    }, [divMore, feedDiscovery, component]);


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
        setNameBtn("more");
        if (feedDiscovery.current && divMore.current) {
            console.log();
            const style = (feedDiscovery.current.style.maxHeight == 'none') ? "240px" : "none";
            feedDiscovery.current.style.maxHeight = style;
            divMore.current.style.height = (feedDiscovery.current.clientHeight + 20) + "px";
            if (style == "none")
                setNameBtn("less");
        }
    }

    return (
        <div className="col-12 feed-component" ref={feedDiscovery}>
            <div className="div-more-discovery" ref={divMore}>
                <button className="btn btn-success z-index-1" onClick={showMoreFeed}>{nameBtn}</button>
            </div>
            <h2>Discovery</h2>
            {component}
        </div>
    )
}

export default FeedDiscovery