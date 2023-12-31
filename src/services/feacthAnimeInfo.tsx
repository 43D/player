import AnimeInfo from "../type/AnimeInfo";

export const feacthAnimeInfo = () => {
    const urlJikan = "https://api.jikan.moe/v4/anime?";
    const urlAnn = "https://cdn.animenewsnetwork.com/encyclopedia/api.xml?"

    async function fetchApiJikan(url: string, requestOptions: RequestInit): Promise<AnimeInfo> {
        const response = await fetch(urlJikan + url, requestOptions);
        if (!response.ok)
            throw new Error('Erro na solicitação');

        const resultText = await response.text();
        const result = JSON.parse(resultText);
        return result;
    };

    async function fetchApiAnn(url: string, requestOptions: RequestInit): Promise<Document> {
        const response = await fetch(urlAnn + url, requestOptions);
        if (!response.ok)
            throw new Error('Erro na solicitação');

        const resultText = await response.text();
        const doc = new DOMParser().parseFromString(resultText, 'application/xml');

        return doc;
    };

    async function fetchAnimeInfoJikan(name: string, year: string) {
        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
        };

        let recurso = "q=" + name + "&sort=asc" + "&start_date=" + year + "-01-01";

        return await fetchApiJikan(recurso, requestOptions);
    }

    async function fetchAnimeInfoAnn(id: string) {
        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
        };

        let recurso = "anime=" + id;

        return await fetchApiAnn(recurso, requestOptions);
    }

    return {
        fetchAnimeInfoJikan,
        fetchAnimeInfoAnn
    }
}