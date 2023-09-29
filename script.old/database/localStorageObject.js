export function localStorageObject() {
    const config = "config";
    const musics = "musics";
    const musicsName = "musicsName";
    const musicsAnime = "musicsAnime";
    const musicsSeason = "musicsSeason";
    const pwa = "pwa";
    const playlists = "playlists";
    const currentPlayList = "currentPlayList";
    const theme = "theme";
    const language = "language";

    function getLocalStorage(key) {
        return getJson(localStorage.getItem(key));
    }

    function setLocalStorage(key, value) {
        localStorage.setItem(key, getString(value));
    }

    function getString(value) {
        return JSON.stringify(value);
    }

    function getJson(value) {
        return JSON.parse(value);
    }

    function getMusics() {
        return getLocalStorage(musics);
    }
    function getPlayLists() {
        return getLocalStorage(playlists);
    }

    function getCurrentPlayList() {
        return getLocalStorage(currentPlayList);
    }
    function getTheme() {
        return getLocalStorage(theme);
    }
    function getLanguage() {
        return getLocalStorage(language);
    }
    function setMusics(json) {
        return setLocalStorage(musics, json);
    }
    function setPlayLists(json) {
        return setLocalStorage(playlists, json);
    }

    function setCurrentPlayList(json) {
        return setLocalStorage(currentPlayList, json);
    }
    function setTheme(json) {
        return setLocalStorage(theme, json);
    }
    function setLanguage(json) {
        return setLocalStorage(language, json);
    }

    function setConfig(json) {
        return setLocalStorage(config, json);
    }

    function getConfig() {
        return getLocalStorage(config);
    }

    function setMusicsName(json) {
        return setLocalStorage(musicsName, json);
    }
    function getMusicsName() {
        return getLocalStorage(musicsName);
    }
    function setMusicsAnime(json) {
        return setLocalStorage(musicsAnime, json);
    }
    function getMusicsAnime() {
        return getLocalStorage(musicsAnime);
    }
    function setMusicsSeason(json) {
        return setLocalStorage(musicsSeason, json);
    }
    function getMusicsSeason() {
        return getLocalStorage(musicsSeason);
    }

    function clear() {
        localStorage.clear();
        location.reload(true);
    }

    function setStreaming(qld) {
        let config = getConfig();
        config['streaming'] = qld;
        setConfig(config);
    }

    function setPwa(json) {
        return setLocalStorage(pwa, json);
    }

    function getPwa() {
        return getLocalStorage(pwa);
    }


    return {
        getMusics,
        getPlayLists,
        getCurrentPlayList,
        getTheme,
        getLanguage,
        getConfig,
        getMusicsAnime,
        getMusicsName,
        getMusicsSeason,
        setMusics,
        setPlayLists,
        setCurrentPlayList,
        setTheme,
        setLanguage,
        setConfig,
        setMusicsAnime,
        setMusicsName,
        setMusicsSeason,
        clear,
        setStreaming,
        getPwa,
        setPwa
    }

}

