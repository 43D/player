import { useEffect, useState } from "react";
import Home from "./components/Home";
import Search from "./components/Search";
import Artist from "./components/Artist";
import Anime from "./components/Anime";
import { database } from "./db/database";
import { useIndexedDB } from "react-indexed-db-hook";

function App() {
  const [component, setComponent] = useState<JSX.Element>();
  const [lastComponent, setLastComponent] = useState<JSX.Element>();
  // const { add, update, getAll, getByID, openCursor } = useIndexedDB("songs");
  const dbSong = useIndexedDB;
  const db = database(dbSong);

  useEffect(() => {
    eventsBtn();
    const componentHome = <Home pageProps={{ pages }} dbProp={db} />
    setLastComponent(componentHome);
    setComponent(componentHome);
  }, []);

  const eventsBtn = () => {
    btnSearch();
    btnHome();
  }

  const pages = () => {
    const getArtist = (id: number) => {
      const art = <Artist id={id} pageProps={{ pages }} dbProp={db} />
      setLastComponent(component);
      setComponent(art);
    };
    const getAnime = (id: number) => {
      const anime = <Anime id={id} pageProps={{ pages }} dbProp={db} />
      setLastComponent(component);
      setComponent(anime);
    };

    const getLastPage = () => {
      console.log(lastComponent);
      console.log(component);
      setComponent(lastComponent);
    }
    return {
      getArtist,
      getAnime,
      getLastPage
    }
  }

  const btnSearch = () => {
    const btn = document.getElementById('btn-search') as HTMLButtonElement;

    btn.addEventListener('click', () => {
      const inputSearch = document.getElementById('search-value') as HTMLInputElement;
      const text = inputSearch["value"];
      const componentSearch = <Search searchString={`${text}`} pageProps={{ pages }} dbProp={db} />;
      setLastComponent(componentSearch);
      setComponent(componentSearch); //pages
    });
  }

  const btnHome = () => {
    const btnImg = document.getElementById('img-home') as HTMLButtonElement;
    btnImg.addEventListener('click', () => {
      const componentHome = <Home pageProps={{ pages }} dbProp={db} />
      setLastComponent(componentHome);
      setComponent(componentHome);
    });
  }



  return (
    <div className="App pt-2 pb-4">
      {component}
    </div>
  );
}

export default App
