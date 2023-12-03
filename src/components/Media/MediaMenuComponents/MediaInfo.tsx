import { ChangeEvent, useEffect, useRef, useState } from "react";
import InterfaceMediaControl from "../../../type/InterfaceMediaControl";
import InterfaceMediaTimeline from "../../../type/InterfaceMediaTimeline";

type menuType = {
    control: () => InterfaceMediaControl;
}
const MediaInfo: React.FC<menuType & { timelineProp: (timelineProp: InterfaceMediaTimeline) => void }> = ({ control, timelineProp }) => {

    const [timeLineValue, setTimeLineValue] = useState<string>("0");

    const timeLineInput = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (timeLineInput.current) {
            timelineProp({
                setTimeline: (time: number) => setTime(time),
            });
        }
    }, []);

    const setTime = (time: number) => {
        setTimeLineValue(time + "");
    }

    const onChangeTime = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (timeLineInput.current) {
            control().changeTimeline(value);
            setTimeLineValue(value);
        }
    }
    return (
        <div className="col-12 col-sm my-1">
            <div className="ui-seekbar px-3 d-flex h-100 justify-content-center flex-column">
                <input type="range" id="timeline-now" ref={timeLineInput} onChange={onChangeTime} className="ui-slider w-100" min="0" max="120000" value={timeLineValue} />
                <div className="h-100 mb-0 row">
                    <div className="col-3 col-sm-2">
                        <span id="time">00:00</span>
                    </div>
                    <div className="col text-center">
                        <span id="name-bar">........?</span>
                    </div>
                    <div className="col-3 col-sm-2 text-end">
                        <span id="duration">00:00</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default MediaInfo