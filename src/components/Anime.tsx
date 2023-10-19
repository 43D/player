import PagesType from "../type/PagesType";

type idType = {
    id: number;
    pageProps: PagesType;
}

function Anime({ id, pageProps }: idType) {


    return (
        <div className="row">
            <div className="col-12 d-flex">
                <button id="artist-return" className="btn artist-return m-1" onClick={() => pageProps.pages().getLastPage()}>
                    <i className="bi bi-arrow-left"></i>
                </button>
                <h2>Avu-chan or {id}</h2>
            </div>
            <div className="col-12">
               <h5> Anime name 2 here</h5>
            </div>
            <div className="col mt-3" id="search-anime">
                <button id="artist-filter-song" className="artist-filter btn btn-secondary m-1">Song Name</button>
                <button id="artist-filter-anime" className="artist-filter btn btn-secondary m-1">Anime Name</button>
                <button id="artist-filter-artist" className="artist-filter btn btn-secondary m-1">Artist Name</button>
            </div>
            <div className="col-12 mt-3">
                a {id}
            </div>
        </div>
    );
}

export default Anime