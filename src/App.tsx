import { useEffect, useState } from "react";
import Home from "./components/Home";
import Search from "./components/Search";
import Artist from "./components/Artist";
import Anime from "./components/Anime";
import { database } from "./db/database";
import { useIndexedDB } from "react-indexed-db-hook";
import Playlist from "./components/Playlist";
import AddPlaylistModal from "./components/Modal/AddPlaylistModal";
import DeletePlaylistModal from "./components/Modal/DeletePlaylistModal";

function App() {
  const [component, setComponent] = useState<JSX.Element>();
  const [componentModal, setComponentModal] = useState<JSX.Element | null>();
  const dbSong = useIndexedDB;
  const db = database(dbSong);

  useEffect(() => {
    eventsBtn();
    const componentHome = <Home pageProps={{ pages }} dbProp={db} />
    setComponent(componentHome);
  }, []);

  const eventsBtn = () => {
    btnSearch();
    btnHome();
    btnClear();
  }

  const pages = () => {
    const getArtist = (id: number) => {
      const art = <Artist id={id} pageProps={{ pages }} dbProp={db} />
      setComponent(art);
    };

    const getAnime = (id: number) => {
      const anime = <Anime id={id} pageProps={{ pages }} dbProp={db} />
      setComponent(anime);
    };

    const getPlaylist = (id: number) => {
      const playlist = <Playlist id={id} pageProps={{ pages }} dbProp={db} />
      setComponent(playlist);
    };

    const addPlaylistModal = (id: number) => {
      setComponentModal(<AddPlaylistModal key={id} id={id} pageProps={{ pages }} dbProp={db}/>);
    };

    const addQueue = (id: number) => {
      console.log("song id: ", id);
    };

    const playSongNow = (id: number) => {
      console.log("song id: ", id);
    };

    const playAnimeNow = (id: number) => {
      console.log("Anime id: ", id);
    };

    const playArtistNow = (id: number) => {
      console.log("Artist id: ", id);
    };

    const playPlaylistNow = (id: number) => {
      console.log("Playlist id: ", id);
    };

    const deletePlaylist = (id: number) => {
      setComponentModal(<DeletePlaylistModal key={id} id={id} pageProps={{ pages }} dbProp={db} />);
    };

    const modalClose = () => {
      setComponentModal(null);
    }

    return {
      getArtist,
      getAnime,
      getPlaylist,
      addPlaylistModal,
      addQueue,
      playSongNow,
      playAnimeNow,
      playArtistNow,
      playPlaylistNow,
      deletePlaylist,
      modalClose
    }
  }

  const btnSearch = () => {
    const btn = document.getElementById('btn-search') as HTMLButtonElement;

    btn.addEventListener('click', () => {
      const inputSearch = document.getElementById('search-value') as HTMLInputElement;
      const text = inputSearch["value"];
      const componentSearch = <Search searchString={`${text}`} pageProps={{ pages }} dbProp={db} />;
      setComponent(componentSearch); //pages
    });
  }

  const btnClear = () => {
    const btn = document.getElementById('btn-clear-data') as HTMLButtonElement;

    btn.addEventListener('click', () => {
      const dbName = 'SuperPlayer';
      const request = indexedDB.deleteDatabase(dbName);

      request.onsuccess = () => {
        console.log(`Banco de dados ${dbName} foi excluído com sucesso.`);
      };

      request.onerror = (event) => {
        console.error(`Erro ao excluir o banco de dados ${dbName}: ${event}`);
      };

      location.reload();
    });


  }

  const btnHome = () => {
    const btnImg = document.getElementById('img-home') as HTMLButtonElement;
    btnImg.addEventListener('click', () => {
      const componentHome = <Home pageProps={{ pages }} dbProp={db} />
      setComponent(componentHome);
    });
  }



  return (
    <div className="App pt-2 pb-4">
      {component}
      {componentModal}
    </div>
  );
}

export default App
