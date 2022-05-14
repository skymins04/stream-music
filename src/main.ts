import App from "./App.svelte";
import { get } from "svelte/store";
import {
  PLAYLIST,
  YT_VIDEO_ID,
  LOCAL_SONG_PATH,
  PLAYER_VOLUME,
} from "./components/common/stores";

const localStoragePlayList = localStorage.getItem("streamMusicPlayList");
if (localStoragePlayList !== null)
  PLAYLIST.set(
    JSON.parse(decodeURIComponent(escape(window.atob(localStoragePlayList))))
  );
const localStoragePlayerVolume = localStorage.getItem("playerVolume");
if (localStoragePlayerVolume !== null)
  PLAYER_VOLUME.set(parseInt(localStoragePlayerVolume));
else {
  localStorage.setItem("playerVolume", String(50));
  PLAYER_VOLUME.set(50);
}

const cs = get(PLAYLIST).currentSong;
if (cs !== null) {
  switch (cs.type) {
    case "youtube":
      YT_VIDEO_ID.set(cs.songId);
      break;
    case "local":
      LOCAL_SONG_PATH.set(cs.songId);
      break;
  }
}

const app = new App({
  target: document.body,
  props: {},
});

export default app;
