import { get } from "svelte/store";

import {
  FLAG_NETWORK_STATUS,
  FLAG_PROTECTOR,
  FLAG_PAGE_SELECTER,
  PROTECTOR_CONTENT,
  PLAYLIST,
  PLAYER_VOLUME,
  YT_VIDEO_ID,
  LOCAL_SONG_PATH,
} from "../common/stores";
import { accessIndexedDB } from "../common/functions";
import { infoToast, errorToast } from "../common/toast";

(() => {
  if (!window.indexedDB) {
    FLAG_PROTECTOR.set(true);
    PROTECTOR_CONTENT.set(
      "해당 브라우저는 IndexedDB를 지원하지 않습니다.<br>Chrome 브라우저를 통해 접속하는 것을 권장합니다."
    );
  } else {
    const indexedDB = window.indexedDB.open("streamMusic");

    indexedDB.onupgradeneeded = (event) => {
      const db = indexedDB.result;
      const store = db.createObjectStore("streamMusic", {
        keyPath: "id",
      });

      indexedDB.onerror = (event) => {
        FLAG_PROTECTOR.set(true);
        PROTECTOR_CONTENT.set(
          "해당 브라우저는 IndexedDB를 지원하지 않습니다.<br>Chrome 브라우저를 통해 접속하는 것을 권장합니다."
        );
      };
    };
  }

  FLAG_NETWORK_STATUS.set(window.navigator.onLine);
  if (!window.navigator.onLine) {
    errorToast("네트워크가 연결되지 않았습니다. 연결상태를 확인하세요.");
  }
  window.addEventListener("online", () => {
    infoToast("네트워크가 연결되었습니다.");
    FLAG_NETWORK_STATUS.set(true);
  });
  window.addEventListener("offline", () => {
    errorToast("네트워크가 해제가 감지되었습니다.");
    FLAG_NETWORK_STATUS.set(false);
  });

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
        const failed = () => {
          get(PLAYLIST).currentSong = null;
          errorToast("음원파일을 찾을 수 없습니다.");
          return;
        };

        accessIndexedDB((store) => {
          if (cs === null) failed();
          else {
            const storeRequest = store.get(cs.songId);

            storeRequest.onerror = failed;
            storeRequest.onsuccess = (event) => {
              if (!storeRequest.result) {
                failed();
              }
              let type: string = "";
              if (storeRequest.result.type === "mp3") type = "audio/mpeg3";
              else if (storeRequest.result.type === "wav") type = "audio/wav";
              else if (storeRequest.result.type === "flac")
                type = "audio/x-flac";
              LOCAL_SONG_PATH.set(
                URL.createObjectURL(new Blob([storeRequest.result.file]))
              );
            };
          }
        }, failed);
        break;
    }
  }
})();
