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

export const FLAG_YT_SEARCH_POPUP = writable(false); // YouTube 음원 추가 팝업 플래그
export const FLAG_SC_SEARCH_POPUP = writable(false); // SoundCloud 음원 추가 팝업 플래그
export const FLAG_LOADING_SCREEN_SAVER = writable(false); // 로딩 스크린 세이버 플래그
export const FLAG_PLAYING = writable(false); // 재생 여부 플래그
export const FLAG_PLAYER_IS_READY = writable(false); // YouTube iframe의 Video on ready 여부 플래그

export const LOADING_SCREEN_SAVER_MSG = writable(""); // 로딩 스크린 세이버 메세지
export const YT_VIDEO_ID = writable(""); // YouTube iframe Video ID
export const LOCAL_SONG_PATH = writable(""); // 로컬 음원 파일 경로
export const PLAYER_ELEMENT = writable({}); // 플레이어 조작 객체

export const PLAYLIST = writable({
  // 현재재생곡, 재생대기열, 히스로리 객체
  currentSong: null,
  queue: [],
  history: [],
} as Playlist);

/**
 * PLAYLIST 객체를 trigging Subscriber하고 LocalStorage에 저장하는 함수
 */
export const savePlayList = () => {
  PLAYLIST.set(get(PLAYLIST));
  localStorage.setItem(
    "streamMusicPlayList",
    btoa(unescape(encodeURIComponent(JSON.stringify(get(PLAYLIST)))))
  );
};

/**
 * 재생을 중지하는 함수
 * @param pause 재생상태 여부, true: 재생, false: 일시정지
 */
export const stopSong = (pause: boolean = false) => {
  get(PLAYLIST).currentSong = null;
  YT_VIDEO_ID.set("");
  LOCAL_SONG_PATH.set("");
  FLAG_PLAYING.set(pause);
  PLAYER_ELEMENT.set({});
  FLAG_PLAYER_IS_READY.set(false);
  savePlayList();
};

/**
 * 재생대기열의 첫번째 노래를 재생하는 함수
 * @param pause 재생상태 여부, true: 재생, false: 일시정지
 */
export const playSong = (pause: boolean) => {
  FLAG_PLAYING.set(pause);
  const currentSong = get(PLAYLIST).currentSong;

  if (currentSong === null) {
    // 현재 재생중인 노래가 없는 상태에서 재생을 시작하는 경우
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
    if (get(PLAYLIST).history.length == 50) get(PLAYLIST).history.splice(49, 1); // 히스토리는 최대 50개까지만 저장
    get(PLAYLIST).history.unshift(get(PLAYLIST).queue[0]);
    savePlayList();
  } else {
    // 현재 재생중인 노래가 있는 경우
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

/**
 * 재생대기열 내의 다음곡을 재생하는 함수
 * @param pause 재생상태 여부, true: 재생, false: 일시정지
 */
export const fowardSong = (pause: boolean) => {
  stopSong();
  setTimeout(() => {
    playSong(pause);
  }, 500);
};
