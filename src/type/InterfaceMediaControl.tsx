export default interface InterfaceMediaControl {
    play: (played: boolean) => void;
    setVolume: (volume: number) => void;
    changeTimeline: (value: string) => void;
    showMedia: () => void;
    playAnotherInTheQueue: (index: number) => void;
    removeFromQueue: (songId: number) => void;
}