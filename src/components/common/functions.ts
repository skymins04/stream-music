import { get } from "svelte/store";
import {
  FLAG_PLAYING,
  FLAG_PLAYER_IS_READY,
  FLAG_NEXT_SONG_LOADING,
  YT_VIDEO_ID,
  LOCAL_SONG_PATH,
  PLAYER_ELEMENT,
  PLAYLIST,
} from "./stores";

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
  if (!get(FLAG_NEXT_SONG_LOADING)) {
    FLAG_NEXT_SONG_LOADING.set(true);
    stopSong();
    if (get(PLAYLIST).queue.length !== 0) {
      setTimeout(() => {
        playSong(pause);
      }, 500);
    }
  }
};
