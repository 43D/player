import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import Anime from '../components/Anime';
import Artist from '../components/Artist';
import Playlist from '../components/Playlist';
import Search from '../components/Search';
import NotFound from '../components/NotFound';
import PagesType from '../type/PagesType';
import DBType from '../type/DBType';

type dependencias = {
  pageProps: () => PagesType;
  dbProp: DBType;
}

function RoutesApp({ pageProps, dbProp }: dependencias) {
  return (
    <Routes>
      <Route path="/" element={<Home key={"0"} dbProp={dbProp} pageProps={pageProps} />} />
      <Route path="/search/:parse" element={<Search key={"0"} dbProp={dbProp} pageProps={pageProps} />} />
      <Route path="/anime/:idAnime" element={<Anime key={"0"} dbProp={dbProp} pageProps={pageProps} />} />
      <Route path="/artist/:idArtist" element={<Artist key={"0"} dbProp={dbProp} pageProps={pageProps} />} />
      <Route path="/playlist/:idPlaylist" element={<Playlist key={"0"} dbProp={dbProp} pageProps={pageProps} />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default RoutesApp;
