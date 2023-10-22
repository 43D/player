import { useEffect, useState } from "react";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import MessageCom from "../MessageCom";
import Navigation from "../utils/Navigation";
import PeopleCardType from "../../type/PeopleCardType";
import ProfileCard from "../ProfileCard";

interface pageProps {
    pageProps: PagesType;
    dbProp: DBType;
}

function HomeComposer({ pageProps, dbProp }: pageProps){

    const cursor = dbProp.getCursorComposer();
    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [componentPages, setComponentPages] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setComponent([<MessageCom key={"51"} msg="Pesquisando compositor, aguarde...." />])
        getAllArtist();
    }, []);

    async function getAllArtist() {
        const count = (await dbProp.getPageCount(3)).count / 100 + 1;
        const pages = parseInt(count + "", 10);
        setComponentPages([<Navigation key={97} count={pages} page={1} switchPage={switchPage} />]);
        const comp = [] as JSX.Element[];

        cursor((evt: any) => {
            var cursor = evt.target.result;
            if (cursor) {
                let result = cursor.value as PeopleCardType;
                comp.push(<ProfileCard key={"ann" + result.idPeople} people={result} pageProps={pageProps} />);
                cursor.continue();
            } else {
                setComponent(comp);
            }
        }, IDBKeyRange.bound(0, 100));
    }

    const switchPage = async (pageSelect: number) => {
        const count = (await dbProp.getPageCount(3)).count / 100 + 1;
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
                let result = cursor.value as PeopleCardType;
                comp.push(<ProfileCard key={"ann" + result.idPeople} people={result} pageProps={pageProps} />);
                cursor.continue();
            } else {
                setComponent(comp);
            }
        }, IDBKeyRange.bound(start, end));

    }

    return (
        <div className="row justify-content-center">
            {componentPages}
            <div className="row p-0">
                {component}
            </div>
        </div>
    );
}

export default HomeComposer