import { useEffect, useState } from "react";
import AnimeCardType from "../../type/AnimeCardType";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import Navigation from "../utils/Navigation";
import MessageCom from "../MessageCom";
import AnimeCard from "../AnimeCard";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
}

function HomeAnime({ pageProps, dbProp }: pageProps){
    const cursor = dbProp.getCursorAnime();
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [componentPages, setComponentPages] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setComponent([<MessageCom key={"51"} msg="Pesquisando animes, aguarde...." />])
        getAllArtist();
    }, []);

    async function getAllArtist() {
        const count = (await dbProp.getPageCount(1)).count / 100 + 1;
        const pages = parseInt(count + "", 10);
        setComponentPages([<Navigation key={97} count={pages} page={1} switchPage={switchPage} />]);
        const comp = [] as JSX.Element[];

        cursor((evt: any) => {
            var cursor = evt.target.result;
            if (cursor) {
                let result = cursor.value as AnimeCardType;
                comp.push(<AnimeCard key={"ann" + result.annId} anime={result} pageProps={pageProps} />);
                cursor.continue();
            } else {
                setComponent(comp);
            }
        }, IDBKeyRange.bound(0, 100));
    }

    const switchPage = async (pageSelect: number) => {
        const count = (await dbProp.getPageCount(1)).count / 100 + 1;
        const pages = parseInt(count + "", 10);
        const comp = <Navigation key={pageSelect} count={pages} page={pageSelect} switchPage={switchPage} />
        reloadComponent(pageSelect);
        setComponentPages([comp]);
    }

    const reloadComponent = (pageSelect: number) => {
        const start = (pageSelect - 1) * 100;
        const end = start + 99;
        const comp = [] as JSX.Element[];
        cursor((evt: any) => {
            var cursor = evt.target.result;
            if (cursor) {
                let result = cursor.value as AnimeCardType;
                comp.push(<AnimeCard key={"ann" + result.annId} anime={result} pageProps={pageProps} />);
                cursor.continue();
            } else {
                setComponent(comp);
            }
        }, IDBKeyRange.bound(start, end));

    }

    return (
        <div className="row mx-2 justify-content-center">
            {componentPages}
            <div className="row p-0">
                {component}
            </div>
        </div>
    );
}

export default HomeAnime