import { useState } from "react";
import { HashRouter } from "react-router-dom";
import RoutesApp from "./routes/routes";

import { database } from "./db/database";
import { useIndexedDB } from "react-indexed-db-hook";
import AddPlaylistModal from "./components/Modal/AddPlaylistModal";
import DeletePlaylistModal from "./components/Modal/DeletePlaylistModal";
import Nav from "./components/Nav";
import ConfigMenu from "./components/Nav/ConfigMenu";
import StorageLocal from "./db/StorageLocal";
import DisplayMedia from "./components/Media/DisplayMedia";
import MediaMenu from "./components/Media/MediaMenu";
import DisplayQueue from "./components/Media/DisplayQueue";
import InterfaceMediaControl from "./type/InterfaceMediaControl";
import React from "react";
import PagesType from "./type/PagesType";
import InterfaceMediaTimeline from "./type/InterfaceMediaTimeline";
import InterfaceMediaQueue from "./type/InterfaceMediaQueue";
import { KeyListenerPlayer } from "./components/utils/KeyListenerPlayer";
import { KeyPressAction } from "./Core/KeyPressAction";
import { KeyboardMenu } from "./components/Nav/KeyboardMenu";

function App() {
  const [queueControll, setQueueControll] = useState<boolean>(false);
  const mediaControl = React.useRef<InterfaceMediaControl | null>(null);
  const mediaTimeline = React.useRef<InterfaceMediaTimeline | null>(null);
  const mediaQueue = React.useRef<InterfaceMediaQueue | null>(null);
  const dbSong = useIndexedDB;
  const db = database(dbSong);
  const store = StorageLocal();
  const [idAddPlaylist, setIdAddPlaylist] = useState<number>(0);
  const [idDeletePlaylist, setIdDeletePlaylist] = useState<number>(0);
  const [observerPlaylist, setObserverPlaylist] = useState<number>(0);
  const [observerDeletePlaylist, setObserverDeletePlaylist] = useState<number>(0);

  const pages = (): PagesType => {
    const addPlaylistModal = (id: number) => {
      setIdAddPlaylist(id);
      setObserverPlaylist(prevObserverPlaylist => prevObserverPlaylist + 1);
    };

    const deletePlaylist = (id: number) => {
      setIdDeletePlaylist(id);
      setObserverDeletePlaylist(prevObserverPlaylist => prevObserverPlaylist + 1);
    };

    const openQueue = () => {
      (queueControll) ? setQueueControll(false) : setQueueControll(true);
      setComponentQueue(<DisplayQueue key={5648} dbProp={db} pageProps={pages} store={store} queueControllProp={(control) => (mediaQueue.current = control)} show={!queueControll} />)
      queuePages().updateQueue();
    };

    const addQueue = (id: number) => {
      store.addQueue(id + "");
    };

    const playSongNow = (id: number) => {
      store.setQueue([id + ""]);
      mediaControl.current?.play(true);
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
      const link = store.getConfig().current_link;
      navigator.clipboard.writeText(link);
    };

    const showVideo = () => {
      mediaControl.current?.showMedia();
    };

    const playQueueId = (index: number) => {
      menu().playAnotherInTheQueue(index);
    }

    const removeQueue = (songId: number) => {
      menu().removeFromQueue(songId);
    }

    const removeFromPlaylist = (songId: number, playlistId: number, obs: any) => {
      db.removeSongInPlaylist(playlistId, songId, obs);
    }

    return {
      addPlaylistModal,
      addQueue,
      playSongNow,
      playAnimeNow,
      playArtistNow,
      playPlaylistNow,
      deletePlaylist,
      openQueue,
      nextQueue,
      previousQueue,
      loopQueue,
      shuffleQueue,
      showVideo,
      getLink,
      playQueueId,
      removeQueue,
      removeFromPlaylist
    }
  }

  const [componentQueue, setComponentQueue] = useState<React.JSX.Element>(<DisplayQueue key={564468} pageProps={pages} store={store} dbProp={db} queueControllProp={(control) => (mediaQueue.current = control)} show={queueControll} />);


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

    const playAnotherInTheQueue = (index: number) => {
      mediaControl.current?.playAnotherInTheQueue(index);
    }

    const removeFromQueue = (songId: number) => {
      mediaControl.current?.removeFromQueue(songId);
    }

    return {
      play,
      setVolume,
      changeTimeline,
      showMedia,
      playAnotherInTheQueue,
      removeFromQueue
    }
  }

  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', function () {
      mediaControl.current?.play(true);
    });

    navigator.mediaSession.setActionHandler('pause', function () {
      mediaControl.current?.play(false);
    });

    navigator.mediaSession.setActionHandler('previoustrack', function () {
      pages().previousQueue();
    });

    navigator.mediaSession.setActionHandler('nexttrack', function () {
      pages().nextQueue();
    });
  }

  const queuePages = (): InterfaceMediaQueue => {
    const updateQueue = () => {
      mediaQueue.current?.updateQueue();
    }

    return { updateQueue }
  }

  const keyPressAction = KeyPressAction({ store, control: menu, pageProps: pages });

  const keyConfig = {
    " ": keyPressAction.play, // 100%
    ".": keyPressAction.nextSong, // 100%
    ",": keyPressAction.prevSong, // 100%
    "s": keyPressAction.shuffle, // 100%
    "z": keyPressAction.getLink, // 100%
    "v": keyPressAction.showVideo, // 100%
  }

  for (let [key, action] of Object.entries(keyConfig))
    KeyListenerPlayer(key, action)

  return (
    <HashRouter>
      <Nav />
      <RoutesApp dbProp={db} pageProps={pages} key={"0"} />
      <DisplayMedia dbProp={db} timelineProp={timeline} queueControllProp={queuePages} control={(control) => (mediaControl.current = control)} store={store} />
      {componentQueue}
      <MediaMenu dbProp={db} pagesProps={pages} menuControlProp={menu} timelineProp={(timelineProp) => (mediaTimeline.current = timelineProp)} store={store} key={4658465} />
      <ConfigMenu store={store} />
      <KeyboardMenu key="45646" />
      <div>
        <AddPlaylistModal key={idAddPlaylist + "add"} id={idAddPlaylist} observer={observerPlaylist} dbProp={db} />
        <DeletePlaylistModal key={idDeletePlaylist + "dele"} id={idDeletePlaylist} observer={observerDeletePlaylist} dbProp={db} />
      </div>
    </HashRouter>
  );
}


export default App