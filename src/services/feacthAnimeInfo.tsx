import AnimeInfo from "../type/AnimeInfo";

export const feacthAnimeInfo = () => {

    const getHostJikan = () => {
        if (window.location.hostname.includes("discordsays.com"))
            return 'https://' + window.location.hostname + "/anime";
        else
            return 'https://api.jikan.moe/v4/anime';
    }

    const getHostAnn = () => {
        if (window.location.hostname.includes("discordsays.com"))
            return 'https://' + window.location.hostname + "/ann";
        else
            return 'https://cdn.animenewsnetwork.com/encyclopedia/api.xml';
    }
    async function fetchApiJikan(url: string, requestOptions: RequestInit): Promise<AnimeInfo | null> {
        try {
            const response = await fetch(getHostJikan() + "?" + url, requestOptions);
            if (!response.ok)
                throw new Error('Erro na solicitação');

            const resultText = await response.text();
            const result = JSON.parse(resultText);
            return result;
        } catch (error) {
            return null;
        }
    };

    async function fetchApiAnn(url: string, requestOptions: RequestInit): Promise<Document | null> {
        try {
            const response = await fetch(getHostAnn() + "?" + url, requestOptions)
            if (!response.ok)
                throw new Error('Erro na solicitação');

            const resultText = await response.text();
            const doc = new DOMParser().parseFromString(resultText, 'application/xml');

            return doc;

        } catch (error) {
            return null;
        }
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