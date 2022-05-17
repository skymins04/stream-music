<script lang="ts">
  import * as jsmediatags from "../common/jsmediatags.min.js";
  import { sha256 } from "js-sha256";

  import { errorToast, infoToast, successToast } from "../common/toast";
  import {
    FLAG_LOADING_SCREEN_SAVER,
    FLAG_LOCAL_SEARCH_POPUP,
    LOADING_SCREEN_SAVER_MSG,
    PLAYLIST,
  } from "../common/stores";
  import { getDurationNumToStr, savePlayList } from "../common/functions";
  import Popup from "../common/Popup.svelte";

  let localFiles: FileList;

  const addToPlayListLocalFile = async (
    file: Blob,
    songId: string,
    title: string,
    artist: string
  ) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    audioContext.decodeAudioData(await file.arrayBuffer(), (buf) => {
      const duration = buf.duration;
      $PLAYLIST.queue.push({
        type: "local",
        songId,
        title,
        artist,
        duration: getDurationNumToStr(duration),
      });
      savePlayList();
      successToast("플레이리스트에 추가되었습니다.");
      LOADING_SCREEN_SAVER_MSG.set("");
      FLAG_LOADING_SCREEN_SAVER.set(false);
      FLAG_LOCAL_SEARCH_POPUP.set(false);
    });
  };

  /**
   * 재생 대기열에 ytSearchID에 해당하는 YouTube 영상 정보를 추가하는 함수
   */
  const onClickAddBtn = async () => {
    LOADING_SCREEN_SAVER_MSG.set("재생대기열에 추가 중...");
    FLAG_LOADING_SCREEN_SAVER.set(true);

    if (localFiles.length !== 0) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = reader.result as string;
        const songId = sha256(fileContent);

        const indexedDB = window.indexedDB.open("streamMusic");
        indexedDB.onerror = (event) => {
          errorToast("재생목록에 추가할 수 없습니다.");
          LOADING_SCREEN_SAVER_MSG.set("");
          FLAG_LOADING_SCREEN_SAVER.set(false);
          FLAG_LOCAL_SEARCH_POPUP.set(false);
        };
        indexedDB.onsuccess = (event) => {
          const db = indexedDB.result;
          const transaction = db.transaction(["streamMusic"], "readwrite");

          transaction.onerror = (event) => {
            errorToast("재생목록에 추가할 수 없습니다.");
            LOADING_SCREEN_SAVER_MSG.set("");
            FLAG_LOADING_SCREEN_SAVER.set(false);
            FLAG_LOCAL_SEARCH_POPUP.set(false);
          };

          const store = transaction.objectStore("streamMusic");
          const storeRequest = store.get(songId);

          storeRequest.onsuccess = (event) => {
            if (!storeRequest.result) {
              store.add({
                id: songId,
                name: localFiles[0].name,
                file: fileContent,
              });
            }
            jsmediatags.read(localFiles[0], {
              onSuccess: async (tag) => {
                addToPlayListLocalFile(
                  localFiles[0],
                  songId,
                  tag.tags.album,
                  tag.tags.artist
                );
              },
              onError: async (err) => {
                infoToast(
                  "메타데이터가 없는 음원파일입니다. 아티스트 명을 수동으로 기입해주세요."
                );
                addToPlayListLocalFile(
                  localFiles[0],
                  songId,
                  localFiles[0].name.replace(/(.mp3|.wav|.flac)$/, ""),
                  "missing"
                );
              },
            });
          };
          storeRequest.onerror = (event) => {
            errorToast("재생목록에 추가할 수 없습니다.");
            LOADING_SCREEN_SAVER_MSG.set("");
            FLAG_LOADING_SCREEN_SAVER.set(false);
            FLAG_LOCAL_SEARCH_POPUP.set(false);
          };
        };
      };

      reader.readAsText(localFiles[0]);
    }
  };
</script>

<Popup popupFlag={FLAG_LOCAL_SEARCH_POPUP}>
  <div class="viewport-title">로컬 음원파일 선택</div>
  <div class="frm-input">
    <input type="file" bind:files={localFiles} accept=".mp3,.wav,.flac" />
    <button on:click={onClickAddBtn}>추가</button>
  </div>
</Popup>

<style lang="scss">
  .displaynone {
    display: none !important;
  }

  .viewport-title {
    color: var(--color1);
    font-size: 2em;
    font-weight: 100;
    width: max-content;
    margin-right: 20px;
    margin-bottom: 5px;
  }

  .frm-input {
    position: relative;
    width: calc(100% - 18em);
    white-space: nowrap;
    min-width: min-content;

    input,
    button {
      margin: 0;
    }

    input {
      font-size: 0.7em;
      height: 3em;
      width: 100% !important;
      min-width: 13em;
      padding-top: 0.6em;
    }

    button {
      position: relative;
      top: 0.1em;
      font-size: 0.7em;
      height: 3em;
      padding: 0 1.5em;
    }
  }
</style>
