type PagesType = {
    pages: () => {
        getArtist: (id: number) => void;
        getAnime: (id: number) => void;
        getPlaylist: (id: number) => void;
        addPlaylistModal: (id: number) => void;
        addQueue: (id: number) => void;
        playSongNow: (id: number) => void;
        playAnimeNow: (id: number) => void;
        playArtistNow: (id: number) => void;
        playPlaylistNow: (id: number) => void;
        deletePlaylist: (id: number) => void;
        modalClose: () => void;
    };
}

export default PagesType