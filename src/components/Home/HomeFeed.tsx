import { useEffect, useState } from "react";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import FeedDiscovery from "../Feed/FeedDiscovery";
import FeedPlaylist from "../Feed/FeedPlaylist";
import FeedListened from "../Feed/FeedListened";
import HomePagesType from "../../type/HomePagesType";
import FeedSongs from "../Feed/FeedSongs";
import FeedArtist from "../Feed/FeedArtist";
import FeedAnime from "../Feed/FeedAnime";
import FeedComposer from "../Feed/FeedComposer";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
    homePages: HomePagesType;
}

function HomeFeed({ pageProps, dbProp, homePages }: pageProps) {
    const [componentDiscovery, setComponentDiscovery] = useState<JSX.Element[]>([]);
    const [componentPlaylist, setComponentPlaylist] = useState<JSX.Element[]>([]);
    const [componentListened, setComponentListened] = useState<JSX.Element[]>([]);
    const [componentSongs, setComponentSongs] = useState<JSX.Element[]>([]);
    const [componentAnime, setComponentAnime] = useState<JSX.Element[]>([]);
    const [componentArtist, setComponentArtist] = useState<JSX.Element[]>([]);
    const [componentComposer, setComponentComposer] = useState<JSX.Element[]>([]);

    useEffect(() => {
        feedDiscovery();
        feedPlaylist();
        feedListened();
        feedSong();
        feedAnime();
        feedArtist();
        feedComposer();
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

    const feedSong = () => {
        const comp = <FeedSongs key={987} pageProps={pageProps} dbProp={dbProp} homePages={homePages} />;
        setComponentSongs([comp]);
    }

    const feedAnime = () => {
        const comp = <FeedAnime key={987} pageProps={pageProps} dbProp={dbProp} homePages={homePages} />;
        setComponentAnime([comp]);
    }

    const feedArtist = () => {
        const comp = <FeedArtist key={987} pageProps={pageProps} dbProp={dbProp} homePages={homePages} />;
        setComponentArtist([comp]);
    }

    const feedComposer = () => {
        const comp = <FeedComposer key={987} pageProps={pageProps} dbProp={dbProp} homePages={homePages} />;
        setComponentComposer([comp]);
    }


    return (
        <div className="row col-12 mt-3">
            {componentDiscovery}
            {componentPlaylist}
            {componentListened}
            {componentSongs}
            {componentAnime}
            {componentArtist}
            {componentComposer}
        </div>
    );
}

export default HomeFeed