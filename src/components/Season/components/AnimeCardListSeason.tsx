import { useNavigate } from "react-router-dom";

export type animeListType = {
    name: string;
    id: number;
    type: string;
    vintage: string;
}

type prop = {
    title: string;
    list: animeListType[];
}

function AnimeCardListSeason({ title, list }: prop) {
    const sortedList = list.sort((a, b) => a.name.localeCompare(b.name));
    const date = title.split("/json/")[1].split(".json")[0];
    const navigate = useNavigate();

    const getSeason = () => {
        const strings = date.split("-");
        return (strings.length > 1) ? strings[0] + " " + strings[1] : strings[0];
    }

    return (<>
        <div className="col-12">
            <h3 className="text-uppercase">{getSeason()}</h3>
        </div>
        <div className="col-12">

            <div className="list-group">
                {sortedList.map(anime => (
                    <button key={"list-season" + anime.id} onClick={() => navigate("/anime/" + anime.id)} type="button" className="list-group-item list-group-item-action">{`${anime.name} (${anime.type})`}</button>
                ))}
            </div>


        </div>
    </>);
}

export default AnimeCardListSeason