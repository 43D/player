import { useEffect, useRef, useState } from "react";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import HomePagesType from "../../type/HomePagesType";
import DBType from "../../type/DBType";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
    homePages: HomePagesType;
}

function FeedPlaylist({ pageProps, dbProp, homePages }: pageProps) {
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const feedDiscovery = useRef<HTMLDivElement>(null);
    const divMore = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const comp = <MessageCom key={987} msg="Buscando algo...." />;
        setComponent([comp]);
    }, []);

    useEffect(() => {
        if (feedDiscovery.current && divMore.current)
            divMore.current.style.height = (feedDiscovery.current.clientHeight + 20) + "px";
    }, [divMore, feedDiscovery, component]);

    const showMoreFeed = () => {
        homePages().createPlaylistction();
    }

    return (
        <div className="col-12 col-lg-6 mt-5 feed-component" ref={feedDiscovery}>
            <div className="div-more-discovery" ref={divMore}>
                <button className="btn btn-success z-index-1" onClick={showMoreFeed}>more...</button>
            </div>
            <h4>My Playlists</h4>
            {component}
        </div>
    )
}

export default FeedPlaylist