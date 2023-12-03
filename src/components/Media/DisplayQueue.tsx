
type displayType = {
    show: boolean;
}

function DisplayQueue({ show }: displayType) {

    let componentStyle: React.CSSProperties = {
        top: "64px",
        minHeight: "75vh",
        backgroundColor: "#212529",
        display: "none"
    };
    if (show)
        componentStyle.display = "block";

    return (
        <div id="display-queue" style={componentStyle} className="container-fluid fixed-top p-0 m-0">
            <div className="row h-100 w-100  p-0 m-0">
                <div className="col-12 h-100 p-0 m-0">
                    a
                </div>
            </div>
        </div>
    );
}


export default DisplayQueue