import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate  } from "react-router-dom";



function Nav() {
    const [inputValue, setInputValue] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: any) => {
        event.preventDefault();
        searchPage(inputValue);
    };

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };

    const searchPage = (parse: string) => {
        navigate("/search/" + parse);
    };

    return (
        <div className="sticky-top text-light">
            <nav className="navbar navbar-expand-md">
                <div className="container-fluid">
                    <Link className="navbar-brand btn" to={"/"} >
                        <img src="./logo.png" width="32" height="32" alt="Anime Song Player" />
                    </Link>
                    <div className="d-flex">
                        <form className="d-flex" role="search" onSubmit={handleSubmit}>
                            <input id="search-value"
                                className="form-control me-2 bg-dark-subtle"
                                type="search"
                                placeholder="Search"
                                aria-label="Search"
                                value={inputValue}
                                onChange={handleInputChange} />
                            <button className="btn btn-outline-success" type="submit" id="btn-search">Search</button>
                        </form>
                        <button className="nav-link mx-4" type="button" data-bs-toggle="modal" data-bs-target="#configsModal">
                            <i className="bi bi-gear"></i>
                        </button>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Nav