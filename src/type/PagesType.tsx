type PagesType = {
    addPlaylistModal: (id: number) => void;
    addQueue: (id: number) => void;
    playSongNow: (id: number) => void;
    playAnimeNow: (songs: string[]) => void;
    playArtistNow: (songs: string[]) => void;
    playPlaylistNow: (id: number) => void;
    deletePlaylist: (id: number) => void;
    openQueue: () => void;
    nextQueue: () => void;
    previousQueue: () => void;
    loopQueue: (loop:boolean) => void;
    shuffleQueue: () => void;
    showVideo: () => void;
    getLink: () => void;
    playQueueId: (index: number) => void
    removeQueue: (songId: number) => void
}

export default PagesType