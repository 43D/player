import { ChangeEvent, useEffect, useRef, useState } from "react";
import InterfaceMediaControl from "../../../type/InterfaceMediaControl";
import InterfaceMediaTimeline from "../../../type/InterfaceMediaTimeline";
import DBType from "../../../type/DBType";
import { useNavigate } from "react-router-dom";

type menuType = {
    control: () => InterfaceMediaControl;
    dbProp: DBType;
}
const MediaInfo: React.FC<menuType & { timelineProp: (timelineProp: InterfaceMediaTimeline) => void }> = ({ control, timelineProp, dbProp }) => {
    const navigate = useNavigate();
    const [timeLineValue, setTimeLineValue] = useState<string>("0");
    const [currentTime, setCurrentTime] = useState<string>("0");
    const [durationValue, setDurationValue] = useState<string>("0");
    const [titleAnime, setTitleAnime] = useState<string>("");
    const [titleArtist, setTitleArtist] = useState<string>("");
    const [animeLink, setAnimeLink] = useState<string>("#");
    const [artistLink, setArtistLink] = useState<string>("#");

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
        if (id == "0" || id == undefined) {
            setTitleAnime("");
            setTitleArtist("");
            setAnimeLink("/");
            setArtistLink("/");
            return;
        }
        const song = await dbProp.getSongById(Number(id));
        setTitleAnime(song.songName);
        setTitleArtist(song.songArtist);
        const idArt = (song.artists[0]) ? song.artists[0].id : 0;
        setAnimeLink("/anime/" + song.annId);
        setArtistLink("/artist/" + idArt);

        // 
    }

    return (
        <div className="col-12 col-sm my-1">
            <div className="ui-seekbar px-3 d-flex h-100 justify-content-center flex-column">
                <div className="d-flex justify-content-between">
                    <p className="mb-0" id="time">{currentTime}</p>
                    <p className="mb-0" id="duration">{durationValue}</p>
                </div>
                <input type="range" id="timeline-now" ref={timeLineInput} onChange={onChangeTime} className="ui-slider w-100" min="0" max="120000" value={timeLineValue} />
                <div className="d-flex titule-bar-name text-center">
                    <p className="m-0 p-0" id="name-bar" style={{ cursor: 'pointer' }} onClick={() => navigate(animeLink)}>「{titleAnime}」</p>
                    <p className="m-0 p-0" id="name-bar" style={{ cursor: 'pointer' }} onClick={() => navigate(artistLink)}>【{titleArtist}】</p>
                </div>
            </div>
        </div>
    );
}


export default MediaInfo