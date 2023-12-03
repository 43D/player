import PagesType from "../../../type/PagesType";

type queueType = {
    pagesProps: () => PagesType
}


function MediaQueue({ pagesProps }: queueType) {




    return (
        <div className="col-12 col-lg-3 col-xl-2">
            <button id="btn-list-collapse" onClick={pagesProps().openQueue} className="btn btn-outline-dark text-light w-100">Queue</button>
        </div>
    );
}


export default MediaQueue