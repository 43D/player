import { useEffect, useState } from "react";
import DBType from "../../type/DBType";
import MessageCom from "../MessageCom";
import Navigation from "../utils/Navigation";
import PeopleCardType from "../../type/PeopleCardType";
import ProfileCard from "../Card/ProfileCard";
import HomeNav from "./HomeNav";

interface pageProps {
    dbProp: DBType;
}

function HomeComposer({ dbProp }: pageProps) {

    const cursor = dbProp.getCursorComposer();
    const [component, setComponent] = useState<React.JSX.Element[]>([]);
    const [componentPages, setComponentPages] = useState<React.JSX.Element[]>([]);

    useEffect(() => {
        setComponent([<MessageCom key={"51"} msg="Pesquisando compositor, aguarde...." />])
        getAllArtist();
    }, []);

    async function getAllArtist() {
        const count = (await dbProp.getPageCount(3)).count;
        const countMath = (count / 100 + 1);
        const pages = parseInt(countMath + "", 10);
        if (count === 0)
            setComponent([<MessageCom key={999} msg="Search for some anime music ani on top, this page only displays information that you have already searched for." />])
        else {
            setComponentPages([<Navigation key={97} count={pages} page={1} switchPage={switchPage} />]);
            const comp = [] as React.JSX.Element[];

            cursor((evt: any) => {
                var cursor = evt.target.result;
                if (cursor) {
                    let result = cursor.value as PeopleCardType;
                    comp.push(<ProfileCard key={"ann" + result.idPeople} people={result} />);
                    cursor.continue();
                } else {
                    setComponent(comp);
                }
            }, IDBKeyRange.bound(0, 100));
        }
    }

    const switchPage = async (pageSelect: number) => {
        const count = (await dbProp.getPageCount(3)).count;
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
        const comp = [] as React.JSX.Element[];
        cursor((evt: any) => {
            var cursor = evt.target.result;
            if (cursor) {
                let result = cursor.value as PeopleCardType;
                comp.push(<ProfileCard key={"ann" + result.idPeople} people={result} />);
                cursor.continue();
            } else {
                setComponent(comp);
            }
        }, IDBKeyRange.bound(start, end));

    }

    return (
        <div id="display-main" className="container-fluid displays">
            <div className="row justify-content-center">
                {<HomeNav />}
                <div className="col-12">
                    <h4>All composers or arrangers found...</h4>
                </div>
                {componentPages}
                <div className="row p-0">
                    {component}
                </div>
            </div>
        </div>
    );
}

export default HomeComposer