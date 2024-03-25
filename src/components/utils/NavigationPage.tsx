interface navigationPageInterface {
    num: number;
    active: number;
    changePage: (page: number) => void;
}

function NavigationPage({ num, active, changePage }: navigationPageInterface) {
    return (
        <li className="page-item">
            <button className={num === active ? "page-link page-number active" : "page-link page-number"} onClick={() => changePage(num)}>{num}</button>
        </li>
    );
}

export default NavigationPage