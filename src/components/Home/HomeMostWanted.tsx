import { useEffect, useState } from "react";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import ListenedType from "../../type/ListenedType";
import AnimeSongListenedCard from "../Card/AnimeSongListenedCard";
import HomeNav from "./HomeNav";

interface pageProps {
    pageProps: () => PagesType;
    dbProp: DBType;
}

function HomeMostWanted({ pageProps, dbProp }: pageProps) {
    const [component, setComponent] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setComponent([<MessageCom key={"512"} msg="Pesquisando a mais escutadas, aguarde...." />])
        const range = 99;
        dbProp.getTopList({ action, range });
    }, []);

    const action = async (result: ListenedType[]) => {
        const comps = [] as JSX.Element[];
        if (result.length === 0) {
            comps.push(<MessageCom key={999} msg="Play some music, this page only displays information about the songs you have already listened to." />);
        } else {
            for (const list of result) {
                const song = await dbProp.getSongById(list.annSongId);
                comps.push(<AnimeSongListenedCard key={list.annSongId} pageProps={pageProps} song={song} count={list.count} />);
            }
        }
        setComponent(comps);
    }

    return (
        <div id="display-main" className="container-fluid displays">
            <div className="row justify-content-center">
                {<HomeNav />}
                <div className="col-12">
                    <h4>Most Listened songs</h4>
                </div>
                <div className="col-12 mt-3">
                    <ul className="list-group">
                        {component}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default HomeMostWanted