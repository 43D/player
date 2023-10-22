import PagesType from "../../type/PagesType";
import PeopleCardType from "../../type/PeopleCardType";

interface CardProps {
    people: PeopleCardType;
    pageProps: PagesType;
}

function ProfileCard({ people, pageProps }: CardProps) {

    return (
        <div className="card col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="card-body">
                <h5 className="card-title">{people.name}</h5>
                <div className="w-100 d-flex justify-content-center">
                    <a href="#" onClick={() => pageProps.pages().getArtist(people.idPeople)} className="btn btn-outline-success mt-2">Open Profile</a>
                </div>
            </div>
        </div>
    );
}

export default ProfileCard