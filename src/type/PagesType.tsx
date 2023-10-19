type PagesType = {
    pages: () => {
        getArtist: (id: number) => void;
        getAnime: (id: number) => void;
        getLastPage: () => void;
    };
}

export default PagesType