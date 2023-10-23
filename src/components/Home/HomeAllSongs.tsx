import MessageCom from "../MessageCom";
import { useEffect, useState } from "react";
import AnimeSongCard from "../Card/AnimeSongCard";
import PagesType from "../../type/PagesType";
import JsonSong from "../../type/Songs";
import DBType from "../../type/DBType";
import Navigation from "../utils/Navigation";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
}

function HomeAllSongs({ pageProps, dbProp }: pageProps) {
    const cursor = dbProp.getCursor();
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [componentPages, setComponentPages] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setComponent([<MessageCom key={"50"} msg="Pesquisando músicas, aguarde...." />])
        getAllSong();
    }, []);

    async function getAllSong() {
        const count = (await dbProp.getPageCount(0)).count;
        const countMath = (count / 100 + 1);
        const pages = parseInt(countMath + "", 10);
        if (count === 0)
            setComponent([<MessageCom key={999} msg="Search for some anime music ani on top, this page only displays information that you have already searched for." />])
        else {
            setComponentPages([<Navigation key={97} count={pages} page={1} switchPage={switchPage} />]);
            const comp = [] as JSX.Element[];

            cursor((evt: any) => {
                var cursor = evt.target.result;
                if (cursor) {
                    let result = cursor.value as JsonSong;
                    comp.push(<AnimeSongCard key={"ann" + result.annSongId} song={result} pageProps={pageProps} />);
                    cursor.continue();
                } else {
                    setComponent(comp);
                }
            }, IDBKeyRange.bound(0, 100));
        }
    }

    const switchPage = async (pageSelect: number) => {
        const count = (await dbProp.getPageCount(0)).count;
        const countMath = (count / 100 + 1);
        const pages = parseInt(countMath + "", 10);

        if (count === 0)
            setComponent([<MessageCom key={999} msg="Search for some anime music ani on top, this page only displays information that you have already searched for." />])
        else {
            const comp = <Navigation key={pageSelect} count={pages} page={pageSelect} switchPage={switchPage} />
            reloadComponent(pageSelect);
            setComponentPages([comp]);
        }

    }

    const reloadComponent = (pageSelect: number) => {
        const start = (pageSelect - 1) * 100;
        const end = start + 99;
        const comp = [] as JSX.Element[];
        cursor((evt: any) => {
            var cursor = evt.target.result;
            if (cursor) {
                let result = cursor.value as JsonSong;
                comp.push(<AnimeSongCard key={"ann" + result.annSongId} song={result} pageProps={pageProps} />);
                cursor.continue();
            } else {
                setComponent(comp);
            }
        }, IDBKeyRange.bound(start, end));

    }

    return (
        <div className="mt-3">
            {componentPages}
            <ul className="list-group">
                {component}
            </ul>
        </div>
    );
}

export default HomeAllSongs