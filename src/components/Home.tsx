import { useEffect, useState } from "react";
import DBType from "../type/DBType";
import PagesType from "../type/PagesType";
import FeedDiscovery from "./Feed/FeedDiscovery";
import FeedPlaylist from "./Feed/FeedPlaylist";
import FeedListened from "./Feed/FeedListened";
import HomeNav from "./Home/HomeNav";
import FeedYouTube from "./Feed/FeedYouTube";

interface pageProps {
    pageProps: () => PagesType;
    dbProp: DBType;
}

function Home({ pageProps, dbProp }: pageProps) {
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
        const comp = <FeedPlaylist key={987} dbProp={dbProp} />;
        setComponentPlaylist([comp]);
    }

    const feedListened = () => {
        const comp = <FeedListened key={987} pageProps={pageProps} dbProp={dbProp} />;
        setComponentListened([comp]);
    }

    return (
        <div id="display-main" className="container-fluid displays">
            <div className="row justify-content-center">
                {<HomeNav />}
                <div className="col-12">
                    {componentDiscovery}
                </div>
                <div className="col-12 col-lg-6">
                    {componentPlaylist}
                </div>
                <div className="col-12 col-lg-6">
                    <FeedYouTube />
                </div>
                <div className="col-12">
                    <div className="w-100 d-flex justify-content-end align-items-end">
                        <button className="btn btn-success mt-3">Maaya Sakamoto Profile - 73 Songs</button>
                    </div>
                </div>
                <div className="col-12 mb-5">
                    {componentListened}
                </div>
            </div>
        </div>
    );
}

export default Home