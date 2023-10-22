type PagesType = {
    pages: () => {
        getArtist: (id: number) => void;
        getAnime: (id: number) => void;
    };
}

export default PagesType