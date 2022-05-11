import App from "./App.svelte";
import { PLAYLIST } from "./stores";

const localStoragePlayList = localStorage.getItem("streamMusicPlayList");
if (localStoragePlayList !== null)
  PLAYLIST.set(JSON.parse(localStoragePlayList));

const app = new App({
  target: document.body,
  props: {},
});

export default app;
