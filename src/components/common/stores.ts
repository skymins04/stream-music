import { writable } from "svelte/store";

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

export const FLAG_ALLOW_MOBILE = writable(false); // 모바일 기기 접속 허용 여부 플래그

export const FLAG_YT_SEARCH_POPUP = writable(false); // YouTube 음원 추가 팝업 플래그
export const FLAG_SC_SEARCH_POPUP = writable(false); // SoundCloud 음원 추가 팝업 플래그
export const FLAG_LOCAL_SEARCH_POPUP = writable(false); // Local 음원파일 추가 팝업 플래그
export const FLAG_LOADING_SCREEN_SAVER = writable(false); // 로딩 스크린 세이버 플래그
export const FLAG_HISTORY_LIST = writable(false); // History List 토글 플래그
export const FLAG_PROTECTOR = writable(false); // 서비스 보호화면 활성화 플래그

export const FLAG_PLAYING = writable(false); // 재생 여부 플래그
export const FLAG_PLAYER_IS_READY = writable(false); // YouTube iframe의 Video on ready 여부 플래그
export const FLAG_PLAYER_IS_BUFFERING = writable(false); // YouTube iframe의 Video on buffering 여부 플래그
export const FLAG_NEXT_SONG_LOADING = writable(false); // 재생 대기열 내의 다음곡을 로딩중인지 여부 플래그
export const FLAG_ON_CHANGE_VOLUME = writable(false); // Player Volume 조절 중인 여부 플래그
export const FLAG_ON_CHANGE_CURRENT_TIME = writable(false); // Player currentTime 조절 중인 여부 플래그
export const FLAG_PLAYER_IS_RUNNING = writable(false); // Player에서 영상이 재생중인지 여부 플래그

export const FLAG_NETWORK_STATUS = writable(false); // 네트워크 연결 상태 플래그
export const FLAG_CLIENT_STATUS = writable(false); // STREAM-MUSIC 클라이언트 연결 상태 플래그

export const LOADING_SCREEN_SAVER_MSG = writable(""); // 로딩 스크린 세이버 메세지
export const YT_VIDEO_ID = writable(""); // YouTube iframe Video ID
export const LOCAL_SONG_PATH = writable(""); // 로컬 음원 파일 경로
export const PLAYER_ELEMENT = writable({}); // 플레이어 조작 객체
export const PROTECTOR_CONTENT = writable(""); // 서비스 보호화면 활성화 플래그
export const PLAYER_VOLUME = writable(0); // 플레이어 볼륨 값
export const PLAYER_CURRENT_TIME = writable(0); // 플레이어 현재 재생 시간
export const PLAYER_DURATION = writable("00:00"); // 플레이어 총 재생 길이

export const PLAYLIST = writable({
  // 현재재생곡, 재생대기열, 히스로리 객체
  currentSong: null,
  queue: [],
  history: [],
} as Playlist);
