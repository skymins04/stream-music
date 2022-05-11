import { writable, get } from "svelte/store";

export interface Song {
  type: string;
  songId: string;
  title: string;
  artist: string;
  duration: string;
}

interface Playlist {
  currentSong: Song | null;
  queue: Array<Song>;
  history: Array<Song>;
}

export const FLAG_YT_SEARCH_POPUP = writable(false);
export const FLAG_SC_SEARCH_POPUP = writable(false);
export const FLAG_LOADING_SCREEN_SAVER = writable(false);
export const FLAG_PLAYING = writable(false);
export const FLAG_PLAYER_IS_READY = writable(false);

export const LOADING_SCREEN_SAVER_MSG = writable("");
export const YT_VIDEO_ID = writable("");
export const LOCAL_SONG_PATH = writable("");
export const PLAYER_ELEMENT = writable({});

export const PLAYLIST = writable({
  currentSong: null,
  queue: [],
  history: [],
} as Playlist);

export const savePlayList = () => {
  PLAYLIST.set(get(PLAYLIST));
  localStorage.setItem(
    "streamMusicPlayList",
    btoa(unescape(encodeURIComponent(JSON.stringify(get(PLAYLIST)))))
  );
};

export const stopSong = (pause: boolean = false) => {
  get(PLAYLIST).currentSong = null;
  YT_VIDEO_ID.set("");
  LOCAL_SONG_PATH.set("");
  FLAG_PLAYING.set(pause);
  (get(PLAYER_ELEMENT) as any).clearVideo();
  PLAYER_ELEMENT.set({});
  FLAG_PLAYER_IS_READY.set(false);
  savePlayList();
};

export const playSong = (pause: boolean) => {
  FLAG_PLAYING.set(pause);
  const currentSong = get(PLAYLIST).currentSong;
  if (currentSong === null) {
    switch (get(PLAYLIST).queue[0].type) {
      case "youtube":
        YT_VIDEO_ID.set(get(PLAYLIST).queue[0].songId);
        break;
      case "local":
        LOCAL_SONG_PATH.set(get(PLAYLIST).queue[0].songId);
        break;
    }
    const song = get(PLAYLIST).queue.shift();
    get(PLAYLIST).currentSong = song === undefined ? null : song;
    if (get(PLAYLIST).history.length == 50) get(PLAYLIST).history.splice(49, 1);
    get(PLAYLIST).history.unshift(get(PLAYLIST).queue[0]);
    savePlayList();
  } else {
    switch (currentSong.type) {
      case "youtube":
        const interval = setInterval(() => {
          if (get(FLAG_PLAYER_IS_READY)) {
            (get(PLAYER_ELEMENT) as any).playVideo();
            clearInterval(interval);
          }
        }, 10);
        break;
      case "local":
        break;
    }
  }
};

export const fowardSong = (pause: boolean) => {
  stopSong();
  setTimeout(() => {
    playSong(pause);
  }, 500);
};
