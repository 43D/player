import PagesType from "../type/PagesType";
import { useEffect, useState } from "react";
import MessageCom from "./MessageCom";
import { feacthAniSong } from "../services/feacthAniSong";
import AnimeAll from "./Anime/AnimeAll";
import AnimeType from "./Anime/AnimeType";
import DBType from "../type/DBType";
import JsonSong from "../type/Songs";
import { feacthAnimeInfo } from "../services/feacthAnimeInfo";
import AnimeInfo from "../type/AnimeInfo";
import AnimeInfomation from "./Anime/AnimeInfomation";
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import HomeNav from "./Home/HomeNav";


type idType = {
    pageProps: () => PagesType;
    dbProp: DBType;
}

function Anime({ pageProps, dbProp }: idType) {
    const { idAnime } = useParams<string>();
    const id = idAnime ? parseInt(idAnime, 10) : 0;
    if (id == 0)
        return <Navigate replace to="/404" />

    const [component, setComponent] = useState<JSX.Element[]>([]);
    const [name, setName] = useState<String>("");
    const [nameJP, setNameJP] = useState<String>("");
    const [nameSeason, setNameSeason] = useState<String>("");
    const [componentSong, setComponentSong] = useState<JSX.Element[]>([]);
    const [componentType, setComponentType] = useState<JSX.Element[]>([]);
    const [componentInfo, setComponentInfo] = useState<JSX.Element[]>([]);
    const [result, setResult] = useState<JsonSong[] | null>(null);
    const [image, setImage] = useState<string>("https://43d.github.io/player/logo.png");
    const [showBTNs, setShowBTNs] = useState<boolean>(false);
    const [showBTNInformation, setShowBTNInformation] = useState<boolean>(false);
    const [showInformationOnly, setShowInformationOnly] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        setShowBTNs(false);
        setShowBTNInformation(false);
        setComponent([<MessageCom key={"43"} msg="Searching, wait..." />])
        searchAllSong();
    }, [id]);

    useEffect(() => {
        getImageUrl();
    }, []);

    const searchAllSong = async () => {
        setShowInformationOnly(false);
        try {
            const result = await feacthAniSong().fetchSongById(id);
            if (result.length > 0) {
                searchAnimeInfo(result[0].annId);
                setName(result[0].animeENName);
                setNameJP(result[0].animeJPName);
                setShowBTNs(true);

                const compSong = <AnimeAll key={"13"} songList={result} pageProps={pageProps} />
                setComponentSong([compSong]);

                const compType = <AnimeType key={"14"} songList={result} pageProps={pageProps} />
                setComponentType([compType]);

                setComponent([compSong]);

                dbProp.saveSongList(result);
                setResult(result);
            } else {
                setOnlyInformation();
            }
        } catch (error) {
            setComponent([<MessageCom key={"433"} msg="Api off-line" />]);
        }
    };

    const setOnlyInformation = async () => {
        setComponent([<MessageCom key={"43"} msg="Songs not found..." />]);
        await searchAnimeInfo(id);
        setShowInformationOnly(true);
    }
    const searchAnimeInfo = async (annId: number) => {
        const animeInfomation = await feacthAnimeInfo().fetchAnimeInfoAnn(String(annId)) as Document;
        const releaseDateText = (animeInfomation.querySelector('anime > info[type="Vintage"]') as Element).textContent;
        const nameAnime = ((animeInfomation.querySelector('anime') as Element).getAttribute("name")) as string;
        setNameJP(nameAnime);
        let titles = Array.from(animeInfomation.querySelectorAll('info[type="Main title"], info[type="Alternative title"]')).map(el => el.textContent) as string[];
        const year = (releaseDateText) ? releaseDateText.split("-")[0] : "1900";
        const animeEN = await feacthAnimeInfo().fetchAnimeInfoJikan(nameAnime, year) as AnimeInfo;
        const result = searchMatch(animeEN, year, titles);

        if (result) {
            const seasonMAl = (result.data[0].season) ? result.data[0].season : "";
            const typeMAL = (result.data[0].type) ? `(${result.data[0].type})` : "";

            setNameSeason(`- ${seasonMAl.toUpperCase()} ${year} ${typeMAL}`);
        }

        setComponentInfo([<AnimeInfomation key={"9787"} animeMal={result} animeAnn={animeInfomation} />]);
        setShowBTNInformation(true);
    }

    const searchMatch = (anime: AnimeInfo, year: string, titles: string[]): AnimeInfo | null => {
        if (anime)
            for (let key in anime.data) {
                let yearMal = String(anime.data[key].year);
                if (yearMal == "null")
                    yearMal = anime.data[key].aired.from.split("-")[0];

                if (yearMal == year) {
                    const res = filterByString(anime, key, titles);
                    if (res)
                        return res;
                }
            }
        return null;
    }

    const filterByString = (anime: AnimeInfo, key: any, titles: string[]): AnimeInfo | null => {
        const value = anime.data[key];
        if (includeStringArray(value.title, titles))
            return {
                data: [value]
            };
        if (value.title_english)
            if (includeStringArray(value.title_english, titles))
                return {
                    data: [value]
                };

        for (let title in value.title_synonyms)
            if (includeStringArray(title, titles))
                return {
                    data: [value]
                };

        for (let title in value.titles) {
            const t = value.titles[title];
            if (includeStringArray(t.title, titles))
                return {
                    data: [value]
                };
        }
        return null;
    }

    const includeStringArray = (title: string, listTittle: string[]) => {
        const uppercasedStrings = listTittle.map(s => s.toUpperCase());
        title = title.toUpperCase();
        for (const text in uppercasedStrings)
            if (isSimilar(uppercasedStrings[text], title))
                return true
        return false;
    }

    function levenshtein(a: string, b: string) {
        const an = a ? a.length : 0;
        const bn = b ? b.length : 0;
        if (an === 0) {
            return bn;
        }
        if (bn === 0) {
            return an;
        }
        const matrix = new Array<number[]>(bn + 1);
        for (let i = 0; i <= bn; ++i) {
            let row = (matrix[i] = new Array<number>(an + 1));
            row[0] = i;
        }
        const firstRow = matrix[0];
        for (let j = 1; j <= an; ++j) {
            firstRow[j] = j;
        }
        for (let i = 1; i <= bn; ++i) {
            for (let j = 1; j <= an; ++j) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] =
                        Math.min(matrix[i - 1][j - 1], matrix[i][j - 1], matrix[i - 1][j]) + 1;
                }
            }
        }
        return matrix[bn][an];
    }

    function isSimilar(s1: string, s2: string) {
        const longerLength = Math.max(s1.length, s2.length);
        const score = levenshtein(s1, s2);
        return (longerLength - score) / longerLength >= 0.70;
    }

    const switchBtn = (id: string) => {
        const elements = document.querySelectorAll('.anime-filter');
        elements.forEach(element => {
            if (element.classList.contains('btn-success'))
                element.classList.remove('btn-success');
            if (!element.classList.contains('btn-secondary'))
                element.classList.add('btn-secondary');
        });
        const el = document.getElementById(id) as HTMLButtonElement;
        if (el) {
            el.classList.remove('btn-secondary');
            el.classList.add('btn-success');
        }
    };

    const createSongAction = () => {
        setComponent(componentSong);
        switchBtn("anime-filter-song");
    };
    const createTypeAction = () => {
        setComponent(componentType);
        switchBtn("anime-filter-type");
    };

    const createInfoAction = () => {
        setComponent(componentInfo);
        switchBtn("anime-filter-info");
    };

    const playSongs = () => {

        if (result) {
            const sortedSongs = [...result].sort((a, b) => a.songName.localeCompare(b.songName));
            let arr = [] as string[];
            for (const value of sortedSongs) {
                arr.push(value.annSongId + "");
            }
            pageProps().playAnimeNow(arr);
        }
    }

    const getImageUrl = () => {
        const exec = async () => {
            const ann = await feacthAnimeInfo().fetchAnimeInfoAnn(String(id));
            let image = getImage(ann as Document);
            if (image == "")
                image = "https://43d.github.io/player/logo.png";
            setImage(image);
        }
        exec();
    }

    const getImage = (animeAnn: Document) => {
        if (animeAnn) {
            const pictureNodes = animeAnn.querySelectorAll('anime > info[type="Picture"] > img');
            let maxResolution = 0;
            let maxResolutionImgSrc = '';
            pictureNodes.forEach((node) => {
                const width = parseInt(node.getAttribute('width') as string);
                const height = parseInt(node.getAttribute('height') as string);
                const resolution = width * height;
                if (resolution > maxResolution) {
                    maxResolution = resolution;
                    maxResolutionImgSrc = node.getAttribute('src') as string;
                }
            });
            return maxResolutionImgSrc;
        }
        return "";
    }

    const shareThisPage = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Anime Song Player: ' + nameJP,
                text: 'Songs of ' + nameJP,
                url: window.location.href,
            })
                .then(() => console.log('Conteúdo compartilhado!'))
                .catch((erro) => console.log('Erro ao compartilhar', erro));
        }
    };

    return (<>
        <Helmet>
            <title>Anime Song Player: {nameJP}</title>
            <meta name="description" content={`Anime Song Player: ${nameJP}`} />
            <meta name="application-name" content={`Anime Song Player: ${nameJP}`} />
            <meta name="author" content="Allan Felipe" />
            <meta name="description"
                content={`Anime Song Player - Listen to the openings, endings, and insert songs from ${nameJP}`} />
            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={`https://43d.github.io/player/#/anime/${id}`} />
            <meta property="og:title" content={`Anime Song Player: ${nameJP}`} />
            <meta property="og:description"
                content={`Anime Song Player - Listen to the openings, endings, and insert songs from ${nameJP}`} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary" />
            <meta property="twitter:url" content={`https://43d.github.io/player/#/anime/${id}`} />
            <meta property="twitter:title" content={`Anime Song Player: ${nameJP}`} />
            <meta property="twitter:description"
                content={`Anime Song Player - Listen to the openings, endings, and insert songs from ${nameJP}`} />
            <meta property="twitter:image" content={image} />
        </Helmet>

        <div id="display-main" className="container-fluid displays">
            <div className="App pb-4">
                <div className="row">
                    {<HomeNav />}
                    {showBTNs && <>
                        <div className="col-12 d-flex align-items-center">
                            <h2>{name}</h2>
                        </div>
                        <div className="col-12">
                            <h5>{nameJP} {nameSeason}</h5>
                        </div>
                        <div className="col mt-3" id="search-anime">
                            <button className='btn btn-outline-secondary m-1 px-2' onClick={() => navigate(-1)}>
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button className="btn btn-outline-success m-1" onClick={playSongs}><i className="bi bi-play"></i> Play</button>
                            <button className="btn btn-outline-success m-1" onClick={shareThisPage}><i className="bi bi-share-fill me-1"></i>Share</button>
                            <br />
                            <button id="anime-filter-song" onClick={createSongAction} className="anime-filter btn btn-success m-1">All Song</button>
                            <button id="anime-filter-type" onClick={createTypeAction} className="anime-filter btn btn-secondary m-1">by Type</button>
                            <button id="anime-filter-info" onClick={createInfoAction} className="anime-filter btn btn-secondary m-1" disabled={!showBTNInformation}>Information</button>
                        </div>
                    </>}
                    <div className="col-12 mt-3">
                        {component}
                        {showInformationOnly && <>
                            {componentInfo}
                        </>}
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

export default Anime