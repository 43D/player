import ConfigType from "../../type/ConfigType";
import DBType from "../../type/DBType";
import InterfaceMediaControl from "../../type/InterfaceMediaControl";
import InterfaceMediaTimeline from "../../type/InterfaceMediaTimeline";
import PagesType from "../../type/PagesType";
import MediaControl from "./MediaMenuComponents/MediaControl";
import MediaInfo from "./MediaMenuComponents/MediaInfo";
import MediaQueue from "./MediaMenuComponents/MediaQueue";

type menuType = {
    pagesProps: () => PagesType;
    menuControlProp: () => InterfaceMediaControl;
    store: {
        getConfig: () => ConfigType;
        setConfig: (data: ConfigType) => void;
    };
    dbProp: DBType;
}

const MediaMenu: React.FC<menuType & { timelineProp: (timelineProp: InterfaceMediaTimeline)  => void }> = ({ pagesProps, menuControlProp, timelineProp, store, dbProp }) => {


    return (
        <div id="bottom-menu" className="fixed-bottom border-top text-light">
            <div className="container-fluid">
                <div className="row py-3">
                    <MediaControl pagesProps={pagesProps} control={menuControlProp} store={store} />
                    <MediaInfo dbProp={dbProp} control={menuControlProp} timelineProp={timelineProp}/>
                    <MediaQueue key={47854} pagesProps={pagesProps} />
                </div>
            </div>
        </div>
    );

}

export default MediaMenu