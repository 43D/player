import { useEffect, useState } from "react";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import FeedDiscovery from "../Feed/FeedDiscovery";
import FeedPlaylist from "../Feed/FeedPlaylist";
import FeedListened from "../Feed/FeedListened";
import HomePagesType from "../../type/HomePagesType";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
    homePages: HomePagesType;
}

function HomeFeed({ pageProps, dbProp, homePages }: pageProps) {
    const [componentDiscovery, setComponentDiscovery] = useState<JSX.Element[]>([]);
    const [componentPlaylist, setComponentPlaylist] = useState<JSX.Element[]>([]);
    const [componentListened, setComponentListened] = useState<JSX.Element[]>([]);

    useEffect(() => {
        feedDiscovery();
        feedPlaylist();
        feedListened();
    }, []);

    const feedDiscovery = () => {
        const comp = <FeedDiscovery key={987} pageProps={pageProps} dbProp={dbProp} />;
        setComponentDiscovery([comp]);
    }

    const feedPlaylist = () => {
        const comp = <FeedPlaylist key={987} pageProps={pageProps} dbProp={dbProp} homePages={homePages} />;
        setComponentPlaylist([comp]);
    }

    const feedListened = () => {
        const comp = <FeedListened key={987} pageProps={pageProps} dbProp={dbProp} homePages={homePages} />;
        setComponentListened([comp]);
    }

    return (
        <div className="row col-12 mt-3">
            {componentDiscovery}
            {componentPlaylist}
            {componentListened}
        </div>
    );
}

export default HomeFeed