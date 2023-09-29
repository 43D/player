// import { player } from "../player/player.js";
// import { musicManager } from "../player/musicManager.js";
// import { playlistManager } from "../player/playlistManager.js";

// const musicsByNameStore = "musicsName";
// const musicsByAnimeStore = "musicsAnime";
// const musicsBySeasonStore = "musicsSeason";
// const musicsStore = "musics";
// const playlistsStore = "playlists";
// const timelineStore = "timeline";

// const dbName = "superPlayerMusic";
// let db;
// let currentPlaylist = [];

// let playerClass;
// let musicManagerClass;
// let playlistManagerClass;

// export function database() {

//     function init(config = {}) {
//         playerClass = (config.player) ? config.player : player();
//         musicManagerClass = (config.musicManager) ? config.musicManager : musicManager();
//         playlistManagerClass = (config.playlistManager) ? config.playlistManager : playlistManager();
//         if (window.indexedDB) {
//             startDB();
//         } else {
//             playerClass.displayDb();
//         }
//     }

//     function startDB() {
//         const request = window.indexedDB.open(dbName, 2);

//         request.onsuccess = (event) => {
//             db = request.result;
//             musicDisplay();
//             playlistDisplay();
//         }

//         request.onupgradeneeded = (event) => {
//             createTables(event.target.result);
//             console.log("Upgraded")
//         }
//     }

//     function createTables(db) {
//         let objectMusicsStore = db.createObjectStore(musicsStore,
//             {
//                 keyPath: 'id',
//                 autoIncrement: true
//             });

//         // name {romaji, english}, artist, broadcast, duration, firstLetter, malid, playlists[], links{mal, anilist, outro}, name, season, type,  url{0,480,720}, year
//         objectMusicsStore.createIndex('season', 'season', { unique: false });
//         objectMusicsStore.createIndex('malid', 'malid', { unique: false });
//         objectMusicsStore.createIndex('firstLetter', 'firstLetter', { unique: false });
//         objectMusicsStore.createIndex('artist', 'artist', { unique: false });
//         objectMusicsStore.createIndex('name', 'name', { unique: false });
//         objectMusicsStore.createIndex('hash', ['name', 'malid'], { unique: true });


//         let objectPlayListStore = db.createObjectStore(playlistsStore,
//             {
//                 keyPath: 'id',
//                 autoIncrement: true
//             });
//         // name, musics []
//         objectPlayListStore.createIndex('name', 'name', { unique: false });

//         // music[]
//         db.createObjectStore(timelineStore,
//             {
//                 keyPath: 'id',
//                 autoIncrement: true
//             });

//         let musicByA = db.createObjectStore(musicsByAnimeStore,
//             {
//                 keyPath: 'id',
//                 autoIncrement: true
//             });
//         musicByA.createIndex('name', 'name', { unique: true });

//         let musicByN = db.createObjectStore(musicsByNameStore,
//             {
//                 keyPath: 'id',
//                 autoIncrement: true
//             });

//         musicByN.createIndex('name', 'name', { unique: true });
//         let musicByS = db.createObjectStore(musicsBySeasonStore,
//             {
//                 keyPath: 'id',
//                 autoIncrement: true
//             });

//         musicByS.createIndex('name', 'name', { unique: true });
//     }

//     async function saveMusic(obj, duration, playlist, lastMusic, name = "playlist") {
//         const music = {
//             "anime": {
//                 "romaji": obj.anime.romaji,
//                 "english": obj.anime.english
//             },
//             "artist": obj.artist,
//             "broadcast": obj.animeType,
//             "duration": duration,
//             "firstLetter": obj.name[0].toUpperCase(),
//             "malid": obj.siteIds.malId,
//             "links": {
//                 "malid": obj.siteIds.malId,
//                 "anilist": obj.siteIds.aniListId,
//                 "kitsuid": obj.siteIds.kitsuId
//             },
//             "name": obj.name,
//             "playlists": {},
//             "season": obj.vintage,
//             "type": obj.type,
//             "url": {
//                 "0": obj.urls.catbox["0"],
//                 "480": obj.urls.catbox["480"],
//                 "720": obj.urls.catbox["720"]
//             },
//             "year": obj.vintage.split(" ")[1]
//         }

//         checkMusicExits(music, playlist, lastMusic, name)
//     }

//     function checkMusicExits(music, playlist, lastMusic, name = "playlist") {
//         let transaction = db.transaction([musicsStore], 'readonly');
//         let objectStore = transaction.objectStore(musicsStore);
//         let index = objectStore.index("hash");
//         let request = index.get([music.name, music.malid]);
//         request.onsuccess = function (e) {
//             const data = request.result;
//             if (!data) {
//                 createMusic(music, playlist, lastMusic, name);
//             } else {
//                 if (playlist) {
//                     currentPlaylist[currentPlaylist.length] = e.target.result;
//                     if (lastMusic)
//                         savePlayList(name);
//                 }
//             }
//             playerClass.reload();
//         };

//     }

//     function createMusic(music, playlist, lastMusic, name = "playlist") {
//         let transaction = db.transaction([musicsStore], 'readwrite');
//         let objectStore = transaction.objectStore(musicsStore);
//         let request = objectStore.put(music);
//         request.onsuccess = (e) => {
//             saveByName(music, e.target.result);
//             saveByAnime(music, e.target.result);
//             saveBySeason(music, e.target.result);
//             if (playlist) {
//                 currentPlaylist[currentPlaylist.length] = e.target.result;
//                 if (lastMusic)
//                     savePlayList(name);
//             }
//             $("#import-count-music").html(Number($("#import-count-music").html()) + 1);
//         };
//     }

//     function savePlayList(name = "playlist") {
//         const play = {
//             "name": name,
//             "musics": currentPlaylist
//         };

//         let transaction = db.transaction([playlistsStore], 'readwrite');
//         let objectStore = transaction.objectStore(playlistsStore);
//         let request = objectStore.add(play);

//         request.onsuccess = (e) => {
//             updateTrackPlaylist(e.target.result);
//             currentPlaylist = [];
//         }
//     }

//     function updateTrackPlaylist(id) {
//         // atualizar music.playlist
//     }

//     function saveByName(music, id) {
//         let transaction = db.transaction([musicsByNameStore], 'readwrite');
//         let objectStore = transaction.objectStore(musicsByNameStore);
//         let index = objectStore.index("name");
//         let request = index.get(music.firstLetter);
//         request.onsuccess = function (e) {
//             let data = request.result;
//             if (data) {
//                 data.musics[data.musics.length] = id;
//             } else {
//                 data = { "name": music.firstLetter, "musics": [id] };
//             }
//             objectStore.put(data);
//         };
//     }

//     function saveByAnime(music, id) {
//         let transaction = db.transaction([musicsByAnimeStore], 'readwrite');
//         let objectStore = transaction.objectStore(musicsByAnimeStore);
//         let index = objectStore.index("name");
//         let request = index.get(music.malid);
//         request.onsuccess = function (e) {
//             let data = request.result;
//             if (data) {
//                 data.musics[data.musics.length] = id;
//             } else {
//                 data = { "name": music.malid, "musics": [id] };
//             }
//             objectStore.put(data);
//         };
//     }

//     function saveBySeason(music, id) {
//         let transaction = db.transaction([musicsBySeasonStore], 'readwrite');
//         let objectStore = transaction.objectStore(musicsBySeasonStore);
//         let index = objectStore.index("name");
//         let request = index.get(music.season);
//         request.onsuccess = function (e) {
//             let data = request.result;
//             if (data) {
//                 data.musics[data.musics.length] = id;
//             } else {
//                 data = { "name": music.season, "musics": [id] };
//             }
//             objectStore.put(data);
//         };
//     }

//     function musicDisplay() {
//         let transaction = db.transaction(musicsStore);
//         let objectStore = transaction.objectStore(musicsStore);
//         objectStore.openCursor().onsuccess = (event) => {
//             let cursor = event.target.result;
//             if (cursor) {
//                 musicManagerClass.incrementMusic(cursor.value);
//                 cursor.continue();
//             }
//         };

//         transaction.oncomplete = () => {
//             musicNameDisplay();
//             musicAnimeDisplay();
//             musicSeasonDisplay();
//         };
//     }

//     function musicNameDisplay() {
//         let transaction = db.transaction(musicsByNameStore);
//         let objectStore = transaction.objectStore(musicsByNameStore);
//         objectStore.openCursor().onsuccess = (event) => {
//             let cursor = event.target.result;
//             if (cursor) {
//                 musicManagerClass.incrementMusicName(cursor.value);
//                 cursor.continue();
//             }
//         };

//         transaction.oncomplete = () => {
//             musicManagerClass.showMusicName();
//             musicManagerClass.start();
//         };
//     }

//     function musicAnimeDisplay() {
//         let transaction = db.transaction(musicsByAnimeStore);
//         let objectStore = transaction.objectStore(musicsByAnimeStore);
//         objectStore.openCursor().onsuccess = (event) => {
//             let cursor = event.target.result;
//             if (cursor) {
//                 musicManagerClass.incrementMusicAnime(cursor.value);
//                 cursor.continue();
//             }
//         };

//         transaction.oncomplete = () => {
//             musicManagerClass.showMusicAnime();
//             musicManagerClass.start();
//         };
//     }

//     function musicSeasonDisplay() {
//         let transaction = db.transaction(musicsBySeasonStore);
//         let objectStore = transaction.objectStore(musicsBySeasonStore);
//         objectStore.openCursor().onsuccess = (event) => {
//             let cursor = event.target.result;
//             if (cursor) {
//                 musicManagerClass.incrementMusicSeason(cursor.value);
//                 cursor.continue();
//             }
//         };

//         transaction.oncomplete = () => {
//             musicManagerClass.showMusicSeason();
//             musicManagerClass.start();
//         };
//     }

//     function playlistDisplay() {
//         let transaction = db.transaction(playlistsStore);
//         let objectStore = transaction.objectStore(playlistsStore);
//         objectStore.openCursor().onsuccess = (event) => {
//             let cursor = event.target.result;
//             if (cursor) {
//                 playlistManagerClass.incrementPlaylist(cursor.value);
//                 cursor.continue();
//             }
//         };

//         transaction.oncomplete = () => {
//             musicPlayListDisplay();
//         };
//     }

//     function musicPlayListDisplay(){
//         let transaction = db.transaction(musicsStore);
//         let objectStore = transaction.objectStore(musicsStore);
//         objectStore.openCursor().onsuccess = (event) => {
//             let cursor = event.target.result;
//             if (cursor) {
//                 playlistManagerClass.incrementMusic(cursor.value);
//                 cursor.continue();
//             }
//         };

//         transaction.oncomplete = () => {
//             console.log("work");

//             playlistManagerClass.showPlaylist();
//             playlistManagerClass.start();
//         };
//     }

//     return {
//         init,
//         saveMusic,
//         musicDisplay,
//         playlistDisplay
//     }
// }

// /**
//  * getBySearch
//  * getById
//  * getByPlaylist
//  * removeById
//  * backupById
//  * backupByPlaylist
//  * RefreshInterface
//  * SaveObjects
//  */