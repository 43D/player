import { useEffect, useState } from "react";
import NavigationPage from "./NavigationPage";
import NavigationDots from "./NavigationDots";

interface navigationInterface {
    count: number;
    page: number;
    switchPage: (page: number) => void;
}

function Navigation({ count, page, switchPage }: navigationInterface) {
    const [component, setComponent] = useState<JSX.Element[]>([]);

    const nextPage = () => {
        const pagePredict = page + 1;
        if (pagePredict <= count)
            switchPage(pagePredict);
    }

    const previewPage = () => {
        const pagePredict = page - 1;
        if (pagePredict > 0)
            switchPage(pagePredict);
    }

    const changePage = (nun: number) => {
        switchPage(nun);
    }

    useEffect(() => {
        const comp = [] as JSX.Element[];

        let start = page - 3;
        if(start <= 0)
            start = 1 

        let i = 0;
        for (let index = start; index <= count; index++) {
            if (i === 6 && index-count < 1) {
                comp.push(<NavigationDots key={count + 1} />);
                comp.push(<NavigationPage key={count} num={count} active={page} changePage={changePage} />);
                break;
            }
            comp.push(<NavigationPage key={index} num={index} active={page} changePage={changePage}  />);
            i++;
        }
        setComponent(comp);
    }, []);

    return (
        <div className="text-center mt-3">
            <div aria-label="Page navigation">
                <ul className="pagination justify-content-center">
                    <li className="page-item">
                        <button className="page-link" id="page-preview-click" onClick={previewPage}>Previous</button>
                    </li>
                    {component}
                    <li className="page-item">
                        <button className="page-link" id="page-next-click" onClick={nextPage}>Next</button>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default Navigation