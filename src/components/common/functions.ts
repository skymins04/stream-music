import { get } from "svelte/store";
import {
  FLAG_PLAYING,
  FLAG_PLAYER_IS_READY,
  FLAG_NEXT_SONG_LOADING,
  FLAG_NETWORK_STATUS,
  FLAG_PLAYER_IS_RUNNING,
  YT_VIDEO_ID,
  LOCAL_SONG_PATH,
  PLAYER_ELEMENT,
  PLAYLIST,
  PLAYER_CURRENT_TIME,
  PLAYER_DURATION,
} from "./stores";
import { errorToast, infoToast } from "./toast";

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
  const currentSong = get(PLAYLIST).currentSong;
  if (currentSong !== null) {
    if (get(PLAYLIST).history.length == 50) get(PLAYLIST).history.splice(49, 1); // 히스토리는 최대 50개까지만 저장
    get(PLAYLIST).history.unshift(currentSong);
  }
  get(PLAYLIST).currentSong = null;
  YT_VIDEO_ID.set("");
  LOCAL_SONG_PATH.set("");
  FLAG_PLAYING.set(pause);
  PLAYER_ELEMENT.set({});
  FLAG_PLAYER_IS_READY.set(false);
  PLAYER_CURRENT_TIME.set(0);
  PLAYER_DURATION.set("00:00");
  FLAG_PLAYER_IS_RUNNING.set(false);
  savePlayList();
};

/**
 * 재생대기열의 첫번째 노래를 재생하는 함수
 * @param pause 재생상태 여부, true: 재생, false: 일시정지
 */
export const playSong = (pause: boolean) => {
  FLAG_PLAYER_IS_RUNNING.set(false);
  FLAG_PLAYING.set(pause);
  const currentSong = get(PLAYLIST).currentSong;

  if (currentSong === null) {
    // 현재 재생중인 노래가 없는 상태에서 재생을 시작하는 경우
    switch (get(PLAYLIST).queue[0].type) {
      case "youtube":
        if (get(FLAG_NETWORK_STATUS))
          YT_VIDEO_ID.set(get(PLAYLIST).queue[0].songId);
        else {
          FLAG_PLAYING.set(false);
          errorToast("YouTube 음원 재생을 위해 네트워크 연결이 필요합니다.");
          return;
        }
        break;
      case "local":
        LOCAL_SONG_PATH.set(get(PLAYLIST).queue[0].songId);
        break;
    }
    get(PLAYLIST).currentSong = get(PLAYLIST).queue[0];
    get(PLAYLIST).queue.shift();
    savePlayList();

    infoToast(
      `Now Playing: ${get(PLAYLIST).currentSong?.title} - ${
        get(PLAYLIST).currentSong?.artist
      }`
    );
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

/**
 * 초(second)를 "mm:ss" 형식으로 변환하는 함수
 * @param sec
 */
export const getDurationNumToStr = (sec: number) => {
  const M = Math.floor(sec / 60);
  const S = Math.floor(sec - M * 60);

  const durationM = String(M).padStart(2, "0");
  const durationS = String(S).padStart(2, "0");

  return `${durationM}:${durationS}`;
};

/**
 * 초(second)를 "mm:ss" 형식으로 변환하는 함수
 * @param sec
 */
export const getDurationStrToNum = (str: string) => {
  return parseInt(str.split(":")[0]) * 60 + parseInt(str.split(":")[1]);
};
