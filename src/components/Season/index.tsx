import { useEffect, useState } from "react";
import HomeNav from "../Home/HomeNav";
import AnimeCardListSeason, { animeListType } from "./components/AnimeCardListSeason";
import MessageCom from "../MessageCom";

function SeasonIndex() {
    const [year, setYear] = useState('2024');
    const [season, setSeason] = useState('all');
    const [componentList, setComponentList] = useState<JSX.Element[]>([]);

    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => setYear(event.target.value);
    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSeason(event.target.value);

    const yearsNaoOrdenados = [1950, 1949, 1948, 1947, 1946, 1944, 1943, 1942, 1939, 1936, 1935, 1933, 1932, 1931, 1930, 1929, 1928, 1926, 1925, 1924, 1918, 1917]
    const yearsGenerate = [] as number[];
    const yearOptions = [] as JSX.Element[];
    // last id: 32502
    for (let y = 2025; y >= 1953; y--) yearsGenerate.push(y);
    const yearsOlds = yearsGenerate.concat(yearsNaoOrdenados);
    yearsOlds.forEach((v) => yearOptions.push(<option key={"year" + v} value={v}>{v}</option>));
    useEffect(() => {
        setComponentList([<MessageCom key={"434545"} msg="loading..." />]);
        searchSeason()
    }, [year, season]);

    const searchSeason = async () => {
        switch (year) {
            case "all":
                searchSeasonAllYear();
                break;
            case "0":
                searchSeasonUnrelaese();
                break;
            default:
                searchSeasonByYear();
                break;
        }
        // const data = await getFileData(`/player/json/${year}.json`);
    }

    const getYearString = (yearS: string) => `/player/json/${yearS}.json`;

    const getYearAndSeasonString = (yearS: string, seasonS: string) => `/player/json/${yearS}-${seasonS}.json`;

    const searchSeasonAllYear = () => {
        const links = [] as string[];
        if (season === "all") {
            yearsOlds.forEach((v) => {
                links.push(getYearString(String(v)));
                links.push(getYearAndSeasonString(String(v), "winter"));
                links.push(getYearAndSeasonString(String(v), "spring"));
                links.push(getYearAndSeasonString(String(v), "summer"));
                links.push(getYearAndSeasonString(String(v), "fall"));
            });
        } else {
            links.push(getYearString(season));
        }
        searchByListLinks(links);
    }

    const searchSeasonUnrelaese = () => {
        const links = [getYearString("no_date")]
        searchByListLinks(links);
    }

    const searchSeasonByYear = () => {
        const links = [] as string[];
        if (season === "all") {
            links.push(getYearString(String(year)));
            links.push(getYearAndSeasonString(String(year), "winter"));
            links.push(getYearAndSeasonString(String(year), "spring"));
            links.push(getYearAndSeasonString(String(year), "summer"));
            links.push(getYearAndSeasonString(String(year), "fall"));
        } else {
            links.push(getYearAndSeasonString(String(year), season));
        }
        searchByListLinks(links);
    }

    const searchByListLinks = async (links: string[]) => {
        const listEl = [] as JSX.Element[];
        for (let index in links) {
            const result = await getFileData(links[index]);
            if (result.length > 0) {
                const el = <AnimeCardListSeason key={"list-" + links[index]} title={links[index]} list={result} />;
                listEl.push(el);
            }
        }
        setComponentList(listEl);
    }

    const getFileData = async (url: string): Promise<animeListType[]> => {
        return await fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error('Network response was not ok');
                return response.json() as Promise<animeListType[]>;
            }).then(data => {
                return data;
            }).catch(error => {
                error;
                return [] as animeListType[];
            });
    }

    return (
        <div id="display-main" className="container-fluid displays">
            <div className="row justify-content-center ">
                {<HomeNav />}
                <div className="col-12">
                    <h4>Search for anime by season</h4>
                    <p>Last update: Winter 2024</p>
                    <p>Some anime can only be found by the year</p>
                </div>
                <div className="col-12">
                    <div className="input-group mb-3">
                        <label className="input-group-text" htmlFor="inputYear">Year</label>
                        <select className="form-select" id="inputYear" value={year} onChange={handleYearChange}>
                            <option value="0">No date</option>
                            <option value="all">All</option>
                            {yearOptions}
                        </select>
                        <label className="input-group-text" htmlFor="inputSeason">Season</label>
                        <select className="form-select" disabled={year === "0"} id="inputSeason" value={season} onChange={handleSeasonChange}>
                            <option value="all">All</option>
                            <option value="winter">Winter</option>
                            <option value="spring">Spring</option>
                            <option value="summer">Summer</option>
                            <option value="fall">Fall</option>
                        </select>
                    </div>
                </div>
                {componentList}
            </div>
        </div>
    );
}

export default SeasonIndex