import { Link } from "react-router-dom";
import PeopleCardType from "../../type/PeopleCardType";

interface CardProps {
    people: PeopleCardType;
}

function ProfileCard({ people }: CardProps) {

    return (
        <div className="col-12 col-md-6 col-lg-4 col-xl-3 p-1">
            <div className="card h-100">
            <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title">{people.name}</h5>
                <div className="w-100 d-flex justify-content-center">
                    <Link className="btn btn-outline-success mt-2" to={"/artist/" + people.idPeople}>Open Profile</Link>
                </div>
            </div>
            </div>
        </div>
    );
}

export default ProfileCard