function HomePlaylist() {


    return (
        <div className="col mt-2">
            <div className="card col-12 col-md-6 col-lg-4 col-xl-3">
                <div className="card-body">
                    <h5 className="card-title text-center">Create a Playlist</h5>
                    <div className="d-flex justify-content-center">
                        <i className="bi bi-plus bi-plus-custom"></i>
                    </div>
                    <div className="w-100 d-flex justify-content-center">
                        <a href="#" className="btn btn-outline-success mt-2">Create Playlist</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePlaylist