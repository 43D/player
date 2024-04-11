import { useEffect } from "react";

export const KeyboardMenu = () => {

    useEffect(() => {

    }, []);

    return (
        <div className="modal fade" id="keyboardModal" tabIndex={-1} aria-labelledby="configurações" aria-hidden="true">
            <div className="modal-dialog modal-lg modal-dialog-scrollable">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="configurações">Keyboard Shortcut</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body row">
                        <div className="col-12 col-lg-6">
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">M</button>
                                <p className="mb-0 ms-2">Mute audio</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">↑</button>
                                <p className="mb-0 ms-2">Increase volume by 5%</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">↓</button>
                                <p className="mb-0 ms-2">Decrease volume by 5%</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">→</button>
                                <p className="mb-0 ms-2">Skip 5 seconds [0%]</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">←</button>
                                <p className="mb-0 ms-2">Back 5 seconds [0%]</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">V</button>
                                <p className="mb-0 ms-2">Show video pop-up</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">P</button>
                                <p className="mb-0 ms-2">Enable video PiP (if you selected 480p or 720p quality) [0%]</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">F</button>
                                <p className="mb-0 ms-2">Show video in full screen (if you selected 480p or 720p quality)  [0%]</p>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">SPACE</button>
                                <p className="mb-0 ms-2">Play/Pause song</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">&gt;</button>
                                <p className="mb-0 ms-2">Next song in Queue</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">&lt;</button>
                                <p className="mb-0 ms-2">Previous song in queue</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">L</button>
                                <p className="mb-0 ms-2">Loop queue</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">S</button>
                                <p className="mb-0 ms-2">Shuffle current queue</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">Q</button>
                                <p className="mb-0 ms-2">Show current queue [50%]</p>
                            </div>
                        </div>

                        <div className="col-12 col-lg-6 mt-2">
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">Z</button>
                                <p className="mb-0 ms-2">Copy current media link [50%]</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">X</button>
                                <p className="mb-0 ms-2">Open the current song's anime profile</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">C</button>
                                <p className="mb-0 ms-2">Open the profile of the current song's main artist</p>
                            </div>

                        </div>
                        <div className="col-12 col-lg-6 mt-2">
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">E</button>
                                <p className="mb-0 ms-2">Set streaming quality to audio only (effects from next song onwards) [50%]</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">R</button>
                                <p className="mb-0 ms-2">Set streaming quality to 480p video (effects from next song onwards) [50%]</p>
                            </div>
                            <div className="d-flex my-2 align-items-center">
                                <button className="btn border disabled">T</button>
                                <p className="mb-0 ms-2">Set streaming quality to 720p video (effects from next song onwards) [50%]</p>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    );
}