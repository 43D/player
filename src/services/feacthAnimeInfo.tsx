import AnimeInfo from "../type/AnimeInfo";

export const feacthAnimeInfo = () => {
    const url = "https://api.jikan.moe/v4/anime?";

    async function fetchAnimeInfo(name: string, year: string) {
        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
        };

        let recurso = url + "q=" + name + "&sort=asc"+"&start_date=" + year + "-01-01";

        return await fetchApi(recurso, requestOptions);
    }

    async function fetchApi(url: string, requestOptions: RequestInit): Promise<AnimeInfo> {
        const response = await fetch(url, requestOptions);
        if (!response.ok)
            throw new Error('Erro na solicitação');

        const resultText = await response.text();
        const result = JSON.parse(resultText);
        return result;
    };

    return {
        fetchAnimeInfo,
    }
}