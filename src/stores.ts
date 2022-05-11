import { writable } from "svelte/store";

export interface Song {
  type: string;
  songId: string;
  title: string;
  artist: string;
  description: string;
  duration: string;
  publishedAt: string;
  thumbnails: Thumbnails;
}

interface Thumbnails {
  default: Thumbnail;
  medium?: Thumbnail;
  high?: Thumbnail;
  standard?: Thumbnail;
  maxres?: Thumbnail;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Playlist {
  currentSong: Song | null;
  queue: Array<Song>;
  history: Array<Song>;
}

export const FLAG_YT_SEARCH_POPUP = writable(false);
export const FLAG_SC_SEARCH_POPUP = writable(false);
export const FLAG_LOADING_SCREEN_SAVER = writable(false);
export const LOADING_SCREEN_SAVER_MSG = writable("");
export const FLAG_PLAYING = writable(false);
export const YT_VIDEO_ID = writable("");
export const PLAYLIST = writable({
  currentSong: null,
  queue: [],
  history: [],
} as Playlist);
