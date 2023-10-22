interface navigationPageInterface {
    num: number;
    active: number;
    changePage: (page: number) => void;
}

function NavigationPage({ num, active, changePage }: navigationPageInterface) {
    return (
        <li className="page-item">
            <a className={num === active ? "page-link page-number active" : "page-link page-number"} href="#" onClick={() => changePage(num)}>{num}</a>
        </li>
    );
}

export default NavigationPage