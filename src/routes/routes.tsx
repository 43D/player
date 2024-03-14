import { Route, Routes } from 'react-router-dom';
import Home from '../components/Home';
import Anime from '../components/Anime';
import Artist from '../components/Artist';
import Playlist from '../components/Playlist';
import Search from '../components/Search';
import NotFound from '../components/NotFound';
import PagesType from '../type/PagesType';
import DBType from '../type/DBType';
import HomePlaylist from '../components/Home/HomePlaylist';
import HomeMostWanted from '../components/Home/HomeMostWanted';
import HomeAllSongs from '../components/Home/HomeAllSongs';
import HomeAnime from '../components/Home/HomeAnime';
import HomeArtist from '../components/Home/HomeArtist';
import HomeComposer from '../components/Home/HomeComposer';

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
      <Route path="/playlist" element={<HomePlaylist key={"h2"} pageProps={pageProps} dbProp={dbProp} />} />
      <Route path="/listened" element={<HomeMostWanted key={"h3"} pageProps={pageProps} dbProp={dbProp} />} />
      <Route path="/song" element={<HomeAllSongs key={"h4"} pageProps={pageProps} dbProp={dbProp} />} />
      <Route path="/anime" element={<HomeAnime key={"h7"} dbProp={dbProp} />} />
      <Route path="/artist" element={<HomeArtist key={"h5"} dbProp={dbProp} />} />
      <Route path="/creator" element={<HomeComposer key={"h6"} dbProp={dbProp}  />} />
      <Route path="/404" element={<NotFound />} />
      <Route path="/*" element={<NotFound />} />
    </Routes>
  );
}

export default RoutesApp;
