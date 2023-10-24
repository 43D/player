import { useEffect, useState } from "react";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import ListenedType from "../../type/ListenedType";
import AnimeSongListenedCard from "../Card/AnimeSongListenedCard";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
}


function HomeMostWanted({ pageProps, dbProp }: pageProps) {
    const [component, setComponent] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setComponent([<MessageCom key={"512"} msg="Pesquisando a mais escutadas, aguarde...." />])
        dbProp.getTopList({ action });
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
        <div className="col mt-3">
            <ul className="list-group">
                {component}
            </ul>
        </div>
    );
}

export default HomeMostWanted