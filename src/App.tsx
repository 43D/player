import { useEffect, useState } from "react";
import Home from "./components/Home";
import Search from "./components/Search";

function App() {

  const [component, setComponent] = useState<JSX.Element>(<Home />);


  useEffect(() => eventsBtn(), []);

  const eventsBtn = () => {
    btnSearch();
    btnHome();
  }

  const pages = () => {
    const getArtist = (id: number) => {
      console.log(id);
    };
    const getAnime = (id: number) => {
      console.log(id);
    };
    return {
      getArtist,
      getAnime
    }
  }

  const btnSearch = () => {
    const btn = document.getElementById('btn-search') as HTMLButtonElement;

    btn.addEventListener('click', () => {
      const inputSearch = document.getElementById('search-value') as HTMLInputElement;
      const text = inputSearch["value"];
      setComponent(<Search searchString={`${text}`} pageProps={{pages}}/>); //pages
    });
  }

  const btnHome = () => {
    const btnImg = document.getElementById('img-home') as HTMLButtonElement;
    btnImg.addEventListener('click', () => setComponent(<Home />));
  }



  return (
    <div className="App pt-2 pb-4">
      {component}
    </div>
  );
}

export default App
