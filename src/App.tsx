import { useEffect, useState } from "react";
import { HashRouter } from "react-router-dom";
import RoutesApp from "./routes/routes";

import { database } from "./db/database";
import { useIndexedDB } from "react-indexed-db-hook";
import AddPlaylistModal from "./components/Modal/AddPlaylistModal";
import DeletePlaylistModal from "./components/Modal/DeletePlaylistModal";
import Nav from "./components/Nav";

function App() {
  const [componentModal, setComponentModal] = useState<JSX.Element | null>();
  const dbSong = useIndexedDB;
  const db = database(dbSong);

  useEffect(() => {
    btnClear();
  }, []);

  const pages = () => {
    const addPlaylistModal = (id: number) => {
      setComponentModal(<AddPlaylistModal key={id} id={id} pageProps={{ pages }} dbProp={db} />);
    };

    const addQueue = (id: number) => {
      console.log("song id: ", id);
    };

    const playSongNow = (id: number) => {
      console.log("song id: ", id);
      db.addListen(id);
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


  return (
    <HashRouter>
      <Nav />
      <RoutesApp dbProp={db} pageProps={{ pages }} key={"0"} />
      {componentModal}
    </HashRouter>
  );
}

export default App
