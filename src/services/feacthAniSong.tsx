import JsonSong from "../type/Songs";

export const feacthAniSong = () => {
    const searchAllBody = (parse: string) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestBody = {
            anime_search_filter: {
                search: parse,
                partial_match: true
            },
            song_name_search_filter: {
                search: parse,
                partial_match: true
            },
            artist_search_filter: {
                search: parse,
                partial_match: true,
                group_granularity: 0,
                max_other_artist: 99
            },
            composer_search_filter: {
                search: parse,
                partial_match: true,
                arrangement: true
            },
            and_logic: false,
            ignore_duplicate: false,
            opening_filter: true,
            ending_filter: true,
            insert_filter: true,
        };

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(requestBody),
            redirect: 'follow',
        };

        return requestOptions;
    }

    const searchByIdBody = (parse: number) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestBody = {
            annId: parse,
            ignore_duplicate: false,
            opening_filter: true,
            ending_filter: true,
            insert_filter: true
        };

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(requestBody),
            redirect: 'follow',
        };

        return requestOptions;
    }

    const artistByIdBody = (parse: number) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestBody = {
            artist_ids: [
                parse
            ],
            group_granularity: 0,
            max_other_artist: 99,
            ignore_duplicate: false,
            opening_filter: true,
            ending_filter: true,
            insert_filter: true
        };

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(requestBody),
            redirect: 'follow',
        };

        return requestOptions;
    }

    const composerByIdBody = (parse: number) => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestBody = {
            composer_ids: [
                parse
            ],
            arrangement: true,
            ignore_duplicate: false,
            opening_filter: true,
            ending_filter: true,
            insert_filter: true
        };

        const requestOptions: RequestInit = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(requestBody),
            redirect: 'follow',
        };

        return requestOptions;
    }

    function fetchAllSong(parse: string) {
        const requestOptions = searchAllBody(parse);
        return fetchApi("https://anisongdb.com/api/search_request", requestOptions);
    };

    function fetchSongById(parse: number) {
        const requestOptions = searchByIdBody(parse);
        return fetchApi("https://anisongdb.com/api/annId_request", requestOptions);
    };

    function fetchArtistById(parse: number) {
        const requestOptions = artistByIdBody(parse);
        return fetchApi("https://anisongdb.com/api/artist_ids_request", requestOptions);
    };

    function fetchComposerById(parse: number) {
        const requestOptions = composerByIdBody(parse);
        return fetchApi("https://anisongdb.com/api/composer_ids_request", requestOptions);
    };

    async function fetchArtistComposerById(parse: number) {
        const resultComposer = await fetchComposerById(parse);
        const resultArtist = await fetchArtistById(parse);
        const resultAll = resultComposer.concat(resultArtist);
        const resultUnique = resultAll.filter((obj: JsonSong, index: number, self: JsonSong[]) =>
            index === self.findIndex((o: JsonSong) => o.annSongId === obj.annSongId)
        );

        return resultUnique;
    };

    async function fetchApi(url: string, requestOptions: RequestInit): Promise<JsonSong[]> {
        const response = await fetch(url, requestOptions);
        if (!response.ok)
            throw new Error('Erro na solicitação');

        const resultText = await response.text();
        const result = JSON.parse(resultText);
        return result;
    };


    return {
        fetchArtistComposerById,
        fetchComposerById,
        fetchArtistById,
        fetchSongById,
        fetchAllSong
    }
}