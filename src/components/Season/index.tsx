import { useEffect, useState } from "react";
import HomeNav from "../Home/HomeNav";

function SeasonIndex() {
    const [year, setYear] = useState('2024');
    const [season, setSeason] = useState('all');
    const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => setYear(event.target.value);
    const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSeason(event.target.value);

    const yearOptions = [];
    // last id: 32502
    for (let y = 2023; y >= 1953; y--)
        yearOptions.push(<option key={"year" + y} value={y}>{y}</option>);


    useEffect(() => {
        console.log(`/player/json/${year}`)
        run();
    }, [year, season]);

    const run = async () => {
        const data = await getFileData(`/player/json/${year}.json`);
        console.log(data);
    }
    const getFileData = async (url: string) => {
        return await fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error('Network response was not ok');
                return response.json();
            }).then(data => {
                return data;
            }).catch(error => {
                return [];
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
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            {yearOptions}
                            <option value="1950">1950</option>
                            <option value="1949">1949</option>
                            <option value="1948">1948</option>
                            <option value="1947">1947</option>
                            <option value="1946">1946</option>
                            <option value="1944">1944</option>
                            <option value="1943">1943</option>
                            <option value="1942">1942</option>
                            <option value="1939">1939</option>
                            <option value="1936">1936</option>
                            <option value="1935">1935</option>
                            <option value="1933">1933</option>
                            <option value="1932">1932</option>
                            <option value="1931">1931</option>
                            <option value="1930">1930</option>
                            <option value="1929">1929</option>
                            <option value="1928">1928</option>
                            <option value="1926">1926</option>
                            <option value="1925">1925</option>
                            <option value="1924">1924</option>
                            <option value="1918">1918</option>
                            <option value="1917">1917</option>
                        </select>
                        <label className="input-group-text" htmlFor="inputSeason">Season</label>
                        <select className="form-select" id="inputSeason" value={season} onChange={handleSeasonChange}>
                            <option value="all">All</option>
                            <option value="winter">Winter</option>
                            <option value="spring">Spring</option>
                            <option value="summer">Summer</option>
                            <option value="fall">Fall</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SeasonIndex