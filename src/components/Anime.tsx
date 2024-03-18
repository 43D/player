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
        try {
            const result = await feacthAniSong().fetchSongById(id);
            if (result.length > 0) {
                searchAnimeInfo(result[0]);
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
                setComponent([<MessageCom key={"43"} msg="Songs not found..." />]);
            }
        } catch (error) {
            setComponent([<MessageCom key={"433"} msg="Api off-line" />]);
        }
    };

    const searchAnimeInfo = async (song: JsonSong) => {
        const animeInfomation = await feacthAnimeInfo().fetchAnimeInfoAnn(String(song.annId)) as Document;
        const releaseDateText = (animeInfomation.querySelector('anime > info[type="Vintage"]') as Element).textContent;
        const year = (releaseDateText) ? releaseDateText.split("-")[0] : "1900"
        const animeEN = await feacthAnimeInfo().fetchAnimeInfoJikan(song.animeENName, year) as AnimeInfo;
        const result = searchMatch(animeEN, year, song);

        if (result) {
            const seasonMAl = (result.data[0].season) ? result.data[0].season : "";
            const typeMAL = (result.data[0].type) ? `(${result.data[0].type})` : "";

            setNameSeason(`- ${seasonMAl.toUpperCase()} ${year} ${typeMAL}`);
        }

        setComponentInfo([<AnimeInfomation key={"9787"} animeMal={result} animeAnn={animeInfomation} />]);
        setShowBTNInformation(true);
    }

    const searchMatch = (anime: AnimeInfo, year: string, song: JsonSong): AnimeInfo | null => {
        if (anime)
            for (let key in anime.data) {
                let yearMal = String(anime.data[key].year);
                if (yearMal == "null")
                    yearMal = anime.data[key].aired.from.split("-")[0];


                if (yearMal == year) {
                    const res = filterByString(anime, key, song);
                    if (res)
                        return res;
                }
            }
        return null;
    }

    const filterByString = (anime: AnimeInfo, key: any, song: JsonSong): AnimeInfo | null => {
        const value = anime.data[key];
        if (includeStringArray(value.title, song.animeENName, song.animeJPName))
            return {
                data: [value]
            };
        if (value.title_english)
            if (includeStringArray(value.title_english, song.animeENName, song.animeJPName))
                return {
                    data: [value]
                };

        for (let title in value.title_synonyms)
            if (includeStringArray(title, song.animeENName, song.animeJPName))
                return {
                    data: [value]
                };

        for (let title in value.titles) {
            const t = value.titles[title];
            if (includeStringArray(t.title, song.animeENName, song.animeJPName))
                return {
                    data: [value]
                };
        }
        return null;
    }

    const includeStringArray = (title: string, nameA: string, nameB: string) => {
        if (title.includes(nameA) || title.includes(nameB))
            return true;
        return false;
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
            <div className="App pt-2 pb-4">
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
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

export default Anime