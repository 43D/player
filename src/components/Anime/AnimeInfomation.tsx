import { useEffect, useState } from 'react';
import AnimeInfo from '../../type/AnimeInfo';
import { useNavigate } from 'react-router-dom';

interface AnimeProps {
    animeMal: AnimeInfo | null;
    animeAnn: Document;
}

type link = {
    name: string;
    url: string;
}

type related = {
    id: string;
    type: string;
    name: string;
}

function AnimeInfomation({ animeMal, animeAnn }: AnimeProps) {
    const [animeName, setAnimeName] = useState<string>("");
    const [pictureAnime, setPictureAnime] = useState<string>("");
    const [type, setType] = useState<string>("");
    const [episode, setEpisode] = useState<string>("??");
    const [duration, setDuration] = useState<string>(" -- ");
    const [score, setScore] = useState<string>("");
    const [reviewer, setReviewer] = useState<string>("??");
    const [scoreMAL, setScoreMAL] = useState<string>("??");
    const [reviewerMAL, setReviewerMAL] = useState<string>("??");
    const [status, setStatus] = useState<string>("??");
    const [vintage, setVintage] = useState<string>("??");
    const [studios, setStudios] = useState<string[]>([]);
    const [links, setLinks] = useState<link[]>([]);
    const [synopsis, setSynopsis] = useState<string>("...");
    const [myAnimeList, setMyAnimeList] = useState<string>("");
    const [myAnimeListId, setMyAnimeListId] = useState<string>("");
    const [annId, setANNId] = useState<string>("");
    const [relatedNextIds, setRelatedNextIds] = useState<related[]>([]);
    const [relatedNextIdsObserver, setRelatedNextIdsObserver] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        setInfoAnn();
        setInfoMal();
    }, []);

    useEffect(() => {
        if (relatedNextIds.length > 0) {
            const endpoint = "https://cdn.animenewsnetwork.com/encyclopedia/api.xml?" + relatedNextIds.map(item => `anime=${item.id}`).join('&');

            setTimeout(() => {
                fetch(endpoint)
                    .then(response => response.text())
                    .then(data => {
                        updateNamesFromXML(data);
                    })
                    .catch(error => console.error('Erro ao buscar dados:', error));
            }, 700);
        }

    }, [relatedNextIdsObserver]);

    const updateNamesFromXML = (xmlString: string) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const animeElements = xmlDoc.getElementsByTagName('anime');
        const animeData = Array.from(animeElements).map(anime => ({
            id: anime.getAttribute('id') || '',
            name: anime.getAttribute('name') || ''
        }));

        setRelatedNextIds(prevState => prevState.map(item => {
            const anime = animeData.find(a => a.id === item.id);
            return anime ? { ...item, name: anime.name } : item;
        }));
    }

    const setInfoAnn = () => {
        setPictureAnime(getImage());
        setAnimeName(getByString('anime > info[type="Main title"]'));
        setReviewer(getByAttributeString('anime > ratings', 'nb_votes'));
        setScore(getByAttributeString('anime > ratings', 'weighted_score'));
        setANNId(getByAttributeString('anime', 'id'));
        setVintage(getByString('anime > info[type="Vintage"]'));
        setSynopsis(getByString('anime > info[type="Plot Summary"]'));
        setLinks(getWebSites());
        setStudios(getStudios());
        const list = getRelatedNextIds();
        if (list != null) {
            setRelatedNextIds(list);
            setRelatedNextIdsObserver(prev => prev + 1)
        }
    }

    const setInfoMal = () => {
        if (animeMal) {
            setEpisode(String(animeMal.data[0].episodes));
            setType(animeMal.data[0].type);
            setDuration(animeMal.data[0].duration);
            setScoreMAL(String(animeMal.data[0].score));
            setReviewerMAL(String(animeMal.data[0].scored_by));
            setStatus(animeMal.data[0].status);
            setMyAnimeListId(String(animeMal.data[0].mal_id));
            setMyAnimeList(animeMal.data[0].url);
        }
    }

    const getImage = () => {
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

    const getWebSites = () => {
        const res = [] as link[];
        if (animeAnn) {
            const websiteNodes = animeAnn.querySelectorAll('anime > info[type="Official website"]');
            websiteNodes.forEach((node) => {
                const json = {
                    url: node.getAttribute('href') as string,
                    name: node.textContent as string
                };
                res.push(json);
            });
        }
        return res;
    }
    const getRelatedNextIds = () => {
        if (animeAnn) {
            const selectors = animeAnn.querySelectorAll("related-next");
            const relatedData = Array.from(selectors).map(selector => ({
                id: selector.getAttribute('id') || '',
                type: selector.getAttribute('rel') || '',
                name: '' // Como solicitado, name será uma string vazia
            }));
            const selectorsPrev = animeAnn.querySelectorAll("related-prev");
            const relatedDataPrev = Array.from(selectorsPrev).map(selector => ({
                id: selector.getAttribute('id') || '',
                type: selector.getAttribute('rel') || '',
                name: '' // Como solicitado, name será uma string vazia
            }));

            return relatedDataPrev.concat(relatedData);
        }
        return [];
    }



    const getStudios = () => {
        const res = [] as string[];
        if (animeAnn) {
            const companyNodes = animeAnn.querySelectorAll('anime > credit');
            companyNodes.forEach((node) => {
                if (node.querySelector("task")?.textContent?.includes("Animation Production"))
                    res.push(node.querySelector("company")?.textContent as string);
            });
        }
        return res;
    }

    const getByString = (parse: string) => {
        if (animeAnn) {
            const selector = animeAnn.querySelector(parse);
            const text = (selector?.textContent) ? selector.textContent : "";
            return text;
        }
        return "";
    }

    const getByAttributeString = (parse: string, attribute: string) => {
        if (animeAnn) {
            const selector = animeAnn.querySelector(parse);
            const text = (selector?.getAttribute(attribute)) ? String(selector.getAttribute(attribute)) : "";
            return text;
        }
        return "";
    }

    return (
        <div className='row'>
            <div className="col-12 my-3">
                <h4>Related next</h4>
                <div className="list-group">
                    {relatedNextIds.map(anime => (
                        anime.name && (
                            <button key={"list-season" + anime.id} onClick={() => navigate("/anime/" + anime.id)} type="button" className="list-group-item list-group-item-action">{`${anime.name} (${anime.type})`}</button>
                        )))}
                </div>
            </div>
            <div className='col-12 col-md-4 col-xl-3 d-flex mb-3'>
                <img className='cover-anime mx-auto ' src={pictureAnime} alt="cover" />
            </div>
            <div className='col'>
                <ul className="list-group">
                    <li className='list-group-item p-0'>
                        <table className="table table-anime table-hover mb-0">
                            <tbody>
                                <tr>
                                    <td colSpan={6}>{animeName} - ({type})</td>
                                </tr>
                                <tr>
                                    <th>Episodies: </th>
                                    <td colSpan={3}>{episode}</td>
                                    <th>Duration: </th>
                                    <td colSpan={3}>{duration}</td>
                                </tr>
                                <tr>
                                    <th>Reviewer users (ANN): </th>
                                    <td colSpan={3}>{reviewer}</td>
                                    <th>Score (ANN): </th>
                                    <td colSpan={3}>{score}</td>
                                </tr>

                                <tr>
                                    <th>Reviewer users (MAL): </th>
                                    <td colSpan={3}>{reviewerMAL}</td>
                                    <th>Score (MAL): </th>
                                    <td colSpan={3}>{scoreMAL}</td>
                                </tr>
                                <tr>
                                    <th>Anime News Network:</th>
                                    <td colSpan={3} ><a href={`https://www.animenewsnetwork.com/encyclopedia/anime.php?id=${annId}`} target='_blank'>ID: {annId}</a></td>
                                    <th>MyAnimeList:</th>
                                    <td colSpan={3}><a href={`${myAnimeList}`} target='_blank'>ID: {myAnimeListId}</a></td>

                                </tr>
                                <tr>
                                    <th>Status:</th>
                                    <td colSpan={3}>{status}</td>
                                    <th>Vintage:</th>
                                    <td colSpan={3}>{vintage}</td>
                                </tr>
                                <tr>
                                    <th>Studios:</th>
                                    <td colSpan={3}>
                                        <ul>
                                            {studios.map((item) => (
                                                <li key={item}>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <th>Oficial Links:</th>
                                    <td colSpan={3}>
                                        <ul>
                                            {links.map((item) => (
                                                <li key={item.url}>
                                                    <a href={item.url} target="_blank">{item.name}</a>
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={6}>
                                        <span className='fw-bold'>Synopsis:</span>
                                        <br />
                                        {synopsis}
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={6}>
                                        <span className='fw-bold'>related-next:</span>
                                        <br />
                                        a
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </li>

                </ul>
            </div>
        </div>
    );
}

export default AnimeInfomation