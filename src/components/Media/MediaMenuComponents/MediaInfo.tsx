import { ChangeEvent, useEffect, useRef, useState } from "react";
import InterfaceMediaControl from "../../../type/InterfaceMediaControl";
import InterfaceMediaTimeline from "../../../type/InterfaceMediaTimeline";
import DBType from "../../../type/DBType";

type menuType = {
    control: () => InterfaceMediaControl;
    dbProp: DBType;
}
const MediaInfo: React.FC<menuType & { timelineProp: (timelineProp: InterfaceMediaTimeline) => void }> = ({ control, timelineProp, dbProp }) => {

    const [timeLineValue, setTimeLineValue] = useState<string>("0");
    const [currentTime, setCurrentTime] = useState<string>("0");
    const [durationValue, setDurationValue] = useState<string>("0");
    const [title, setTitle] = useState<string>("-");

    const timeLineInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (timeLineInput.current) {
            timelineProp({
                setTimeline: (time: number, duration: number) => setTime(time, duration),
                setId: (id: string) => getInfo(id),
            });
        }
    }, []);

    const setTime = (time: number, duration: number) => {
        setTimeLineValue(time + "");
        setCurrentTime((time * duration / 120000).toFixed(0));
        setDurationValue(duration.toFixed(0));
    }

    const onChangeTime = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (timeLineInput.current) {
            control().changeTimeline(value);
            setTimeLineValue(value);
        }
    }

    const getInfo = async (id: string) => {
        const song = await dbProp.getSongById(Number(id));
        setTitle(song.songName + " - " + song.songArtist);
    }

    return (
        <div className="col-12 col-sm my-1">
            <div className="ui-seekbar px-3 d-flex h-100 justify-content-center flex-column">
                <input type="range" id="timeline-now" ref={timeLineInput} onChange={onChangeTime} className="ui-slider w-100" min="0" max="120000" value={timeLineValue} />
                <div className="h-100 mb-0 row">
                    <div className="col-3 col-sm-2">
                        <span id="time">{currentTime}</span>
                    </div>
                    <div className="col text-center">
                        <span id="name-bar">{title}</span>
                    </div>
                    <div className="col-3 col-sm-2 text-end">
                        <span id="duration">{durationValue}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default MediaInfo