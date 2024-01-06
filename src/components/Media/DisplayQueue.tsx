import { useEffect, useState } from "react";
import InterfaceMediaQueue from "../../type/InterfaceMediaQueue";
import ConfigType from "../../type/ConfigType";
import DBType from "../../type/DBType";
import PagesType from "../../type/PagesType";
import AnimeSongQueueCard from "../Card/AnimeSongQueueCard";

type displayType = {
    show: boolean;
    queueControllProp: (control: InterfaceMediaQueue) => void;
    store: {
        getConfig: () => ConfigType;
        setQueue: (data: string[]) => void;
        addQueue: (data: string) => void;
        getQueue: () => string[];
    };
    dbProp: DBType;
    pageProps: () => PagesType;

}

function DisplayQueue({ queueControllProp, show, store, dbProp, pageProps }: displayType) {
    const [components, setComponents] = useState<JSX.Element[]>([]);

    let componentStyle: React.CSSProperties = {
        top: "64px",
        position: 'fixed',
        zIndex: '43',
        backgroundColor: "#212529",
        display: "none"
    };
    if (show)
        componentStyle.display = "block";

    useEffect(() => {
        queueControllProp({
            updateQueue: () => updateQueue(),
        });
    }, [queueControllProp]);

    const updateQueue = () => {
        const playIndex = store.getConfig().playIndex;
        const queueIndex = store.getQueue();
        const list = [] as JSX.Element[];
        queueIndex.forEach((value, index) => {
            list.push(<AnimeSongQueueCard key={value + "queue"} playIndex={playIndex} indexQueue={index} dbProp={dbProp} id={value} pageProps={pageProps} />)
        });
        setComponents(list);
    }


    return (
        <div id="display-queue" style={componentStyle} className="container-fluid fixed-top displays p-0 m-0">
            <div className="row h-100 w-100  p-0 m-0">
                <div className="col-12 h-100 py-4 m-0" style={{ overflowY: "auto" }}>
                    <ul className="list-group">
                        {components}
                    </ul>
                </div>
            </div>
        </div>
    );
}


export default DisplayQueue