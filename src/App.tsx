import { useState } from "react";
import { HashRouter } from "react-router-dom";
import RoutesApp from "./routes/routes";

import { database } from "./db/database";
import { useIndexedDB } from "react-indexed-db-hook";
import AddPlaylistModal from "./components/Modal/AddPlaylistModal";
import DeletePlaylistModal from "./components/Modal/DeletePlaylistModal";
import Nav from "./components/Nav";
import ConfigMenu from "./components/Config/ConfigMenu";
import StorageLocal from "./db/StorageLocal";
import DisplayMedia from "./components/Media/DisplayMedia";
import MediaMenu from "./components/Media/MediaMenu";
import DisplayQueue from "./components/Media/DisplayQueue";
import InterfaceMediaControl from "./type/InterfaceMediaControl";
import React from "react";
import PagesType from "./type/PagesType";
import InterfaceMediaTimeline from "./type/InterfaceMediaTimeline";

function App() {
  const [componentModal, setComponentModal] = useState<JSX.Element | null>();
  const [queueControll, setQueueControll] = useState<boolean>(false);
  const [componentQueue, setComponentQueue] = useState<JSX.Element>(<DisplayQueue key={564468} show={queueControll} />);
  const mediaControl = React.useRef<InterfaceMediaControl | null>(null);
  const mediaTimeline = React.useRef<InterfaceMediaTimeline | null>(null);
  const dbSong = useIndexedDB;
  const db = database(dbSong);
  const store = StorageLocal();

  const pages = (): PagesType => {
    const addPlaylistModal = (id: number) => {
      setComponentModal(<AddPlaylistModal key={id} id={id} pageProps={pages} dbProp={db} />);
    };

    const openQueue = () => {
      (queueControll) ? setQueueControll(false) : setQueueControll(true);
      setComponentQueue(<DisplayQueue key={5648} show={!queueControll} />)
    };

    const addQueue = (id: number) => {
      store.addQueue(id + "");
    };

    const playSongNow = (id: number) => {
      store.setQueue([id + ""]);
      mediaControl.current?.play(true);
      db.addListen(id);
    };

    const playAnimeNow = (songs: string[]) => {
      store.setQueue(songs);
      mediaControl.current?.play(true);
    };

    const playArtistNow = async (songs: string[]) => {
      store.setQueue(songs);
      mediaControl.current?.play(true);
    };

    const playPlaylistNow = async (id: number) => {
      const result = await db.getByIdPlaylist(id);
      const arrayDeStrings: string[] = result.songsCollections.map(numero => String(numero));
      store.setQueue(arrayDeStrings);
      mediaControl.current?.play(true);
    };

    const deletePlaylist = (id: number) => {
      setComponentModal(<DeletePlaylistModal key={id} id={id} pageProps={pages} dbProp={db} />);
    };

    const modalClose = () => {
      setComponentModal(null);
    }

    const nextQueue = () => {
      const json = StorageLocal().getConfig();
      const queue = StorageLocal().getQueue();
      const index = (json.playIndex + 1 == queue.length) ? 0 : json.playIndex + 1;
      json.playIndex = index;
      json.playNowId = queue[index];
      StorageLocal().setConfig(json);
      mediaControl.current?.play(true);
    };

    const previousQueue = () => {
      const json = StorageLocal().getConfig();
      const queue = StorageLocal().getQueue();
      const index = (json.playIndex - 1 < 0) ? queue.length - 1 : json.playIndex - 1;
      json.playIndex = index;
      json.playNowId = queue[index];
      StorageLocal().setConfig(json);
      mediaControl.current?.play(true);
    };

    const loopQueue = (loop: boolean) => {
      const json = StorageLocal().getConfig();
      json.loop = loop;
      StorageLocal().setConfig(json);
    };


    const shuffleArray = (array: string[]) => {
      let currentIndex = array.length;
      let randomIndex;
      while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }

      return array;
    }
    const shuffleQueue = () => {
      let json = StorageLocal().getQueue();
      json = shuffleArray(json);
      StorageLocal().setQueue(json);
      mediaControl.current?.play(true);
    };

    const getLink = async () => {
      const conf = StorageLocal().getConfig();
      const song = await db.getSongById(Number(conf.playNowId));
      let link = "";
      if (conf.streaming == "0")
        link = song.audio;
      else if (conf.streaming == "480")
        link = song.MQ;
      else
        link = song.HQ;

      navigator.clipboard.writeText(link);
    };

    const showVideo = () => {
      mediaControl.current?.showMedia();
    };

    return {
      addPlaylistModal,
      addQueue,
      playSongNow,
      playAnimeNow,
      playArtistNow,
      playPlaylistNow,
      deletePlaylist,
      modalClose,
      openQueue,
      nextQueue,
      previousQueue,
      loopQueue,
      shuffleQueue,
      showVideo,
      getLink
    }
  }
  const timeline = (): InterfaceMediaTimeline => {
    const setTimeline = (time: number, duration: number) => {
      mediaTimeline.current?.setTimeline(time, duration);
    };

    const setId = (id: string) => {
      mediaTimeline.current?.setId(id);
    }

    return {
      setTimeline,
      setId
    }
  }

  const menu = (): InterfaceMediaControl => {
    const play = (played: boolean) => {
      mediaControl.current?.play(played);
    }

    const setVolume = (volume: number) => {
      mediaControl.current?.setVolume(volume);
    }

    const changeTimeline = (value: string) => {
      mediaControl.current?.changeTimeline(value);
    }
    const showMedia = () => {
      mediaControl.current?.showMedia();
    }

    return {
      play,
      setVolume,
      changeTimeline,
      showMedia
    }
  }





  return (
    <HashRouter>
      <Nav />
      <RoutesApp dbProp={db} pageProps={pages} key={"0"} />
      {componentModal}
      <DisplayMedia dbProp={db} timelineProp={timeline} control={(control) => (mediaControl.current = control)} store={store} />
      {componentQueue}
      <MediaMenu dbProp={db} pagesProps={pages} menuControlProp={menu} timelineProp={(timelineProp) => (mediaTimeline.current = timelineProp)} store={store} key={4658465} />
      <ConfigMenu store={store} />
    </HashRouter>
  );
}


export default App