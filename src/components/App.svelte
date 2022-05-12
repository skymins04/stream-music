<script lang="ts">
  import YtSearch from "./YTSearch.svelte";
  import YouTube from "svelte-youtube";
  import LoadingScreenSaver from "./LoadingScreenSaver.svelte";
  import Btn from "./Btn.svelte";
  import SongControl from "./SongControl.svelte";
  import PlayListTable from "./PlayListTable.svelte";
  import NowPlaying from "./NowPlaying.svelte";
  import HistoryList from "./HistoryList.svelte";
  import { ToastContainer, FlatToast } from "svelte-toasts";
  import { infoToast } from "../toast";

  import {
    FLAG_YT_SEARCH_POPUP,
    FLAG_LOADING_SCREEN_SAVER,
    FLAG_PLAYER_IS_READY,
    FLAG_PLAYING,
    FLAG_NEXT_SONG_LOADING,
    FLAG_HISTORY_LIST,
    YT_VIDEO_ID,
    LOCAL_SONG_PATH,
    PLAYER_ELEMENT,
    fowardSong,
  } from "../stores";

  // 실수로 페이지를 빠져나가는 것을 방지
  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
  });

  /**
   * YouTube iframe의 Event handler를 얻는 함수
   * @param event
   */
  const onReadyYoutubePlayer = (event) => {
    PLAYER_ELEMENT.set(event.detail.target);
  };

  /**
   * YouTube iframe의 상태변화 Event handler
   * @param event
   */
  const onStateChangeYoutubePlayer = (event) => {
    if (event.detail.data === -1) {
      // not started
      FLAG_PLAYER_IS_READY.set(false);
    } else if (event.detail.data === 0) {
      // end video
      fowardSong($FLAG_PLAYING);
    } else if (event.detail.data === 1) {
      // is playing
      FLAG_PLAYING.set(true);
    } else if (event.detail.data === 2) {
      // paused
      FLAG_PLAYING.set(false);
    } else if (event.detail.data === 5) {
      // video on ready
      if ($FLAG_PLAYING) ($PLAYER_ELEMENT as any).playVideo();
      FLAG_PLAYER_IS_READY.set(true);
      FLAG_NEXT_SONG_LOADING.set(false);
    }
  };
</script>

<ToastContainer let:data>
  <FlatToast {data} />
</ToastContainer>

{#if $FLAG_LOADING_SCREEN_SAVER}
  <LoadingScreenSaver />
{/if}
{#if $FLAG_YT_SEARCH_POPUP}
  <YtSearch />
{/if}

<HistoryList />

<div id="main-header">
  <div class="bg" />
  <h1>STREAM-MUSIC</h1>
</div>

<div id="main-viewport">
  <div class="block controller">
    <SongControl />
    <div class="btns">
      <div class="btns">
        <Btn
          label={"설정"}
          onClick={() => {
            infoToast("현재 서비스 준비중입니다!");
          }}
        />
      </div>
    </div>
  </div>

  <div class="infomation">
    <div class="block info-area" id="song-area">
      <div class="sub-block player-area">
        {#if $YT_VIDEO_ID != ""}
          <YouTube
            videoId={$YT_VIDEO_ID}
            on:ready={onReadyYoutubePlayer}
            on:stateChange={onStateChangeYoutubePlayer}
          />
        {:else if $LOCAL_SONG_PATH != ""}{:else}
          <div id="none-song">
            <svg
              class="icon play"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              ><path
                d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM176 168V344C176 352.7 180.7 360.7 188.3 364.9C195.8 369.2 205.1 369 212.5 364.5L356.5 276.5C363.6 272.1 368 264.4 368 256C368 247.6 363.6 239.9 356.5 235.5L212.5 147.5C205.1 142.1 195.8 142.8 188.3 147.1C180.7 151.3 176 159.3 176 168V168z"
              /></svg
            >
          </div>
        {/if}
      </div>
      <div class="sub-block">
        <div class="title">Now Playing</div>
        <NowPlaying />
      </div>
    </div>
    <div class="block info-area" id="playlist-area">
      <div class="title-area">
        <div class="title">PlayList</div>
        <div class="btns">
          <Btn
            label={"YouTube 음원 추가"}
            onClick={() => {
              FLAG_YT_SEARCH_POPUP.set(!$FLAG_YT_SEARCH_POPUP);
            }}
          />
          <Btn
            label={"로컬 음원파일 추가"}
            onClick={() => {
              infoToast("현재 서비스 준비중입니다!");
            }}
          />
          <Btn
            label={`<svg style="width: 1em; height: 1em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C201.7 512 151.2 495 109.7 466.1C95.2 455.1 91.64 436 101.8 421.5C111.9 407 131.8 403.5 146.3 413.6C177.4 435.3 215.2 448 256 448C362 448 448 362 448 256C448 149.1 362 64 256 64C202.1 64 155 85.46 120.2 120.2L151 151C166.1 166.1 155.4 192 134.1 192H24C10.75 192 0 181.3 0 168V57.94C0 36.56 25.85 25.85 40.97 40.97L74.98 74.98C121.3 28.69 185.3 0 255.1 0L256 0zM256 128C269.3 128 280 138.7 280 152V246.1L344.1 311C354.3 320.4 354.3 335.6 344.1 344.1C335.6 354.3 320.4 354.3 311 344.1L239 272.1C234.5 268.5 232 262.4 232 256V152C232 138.7 242.7 128 256 128V128z"/></svg>`}
            onClick={() => {
              FLAG_HISTORY_LIST.set(!$FLAG_HISTORY_LIST);
            }}
          />
        </div>
      </div>
      <table class="playlist-table">
        <colgroup>
          <col width="40px" />
          <col width="300px" />
          <col width="150px" />
          <col width="70px" />
          <col width="70px" />
          <col width="100px" />
        </colgroup>
        <thead>
          <tr>
            <th>NO</th>
            <th>TITLE</th>
            <th>ARTIST</th>
            <th>PLATFORM</th>
            <th>DURATION</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
      </table>
      <div class="playlist-table-scrollbox">
        <PlayListTable />
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  .btns {
    position: relative;
    max-width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 10px;
  }

  #main-header {
    position: relative;
    width: 100%;

    .bg {
      position: absolute;
      top: -40px;
      left: -25%;
      width: 150%;
      height: 150px;
      background-color: white;
      z-index: 1;
      transform: rotate(-2deg);
      box-shadow: 0 0 5px #555;
    }

    h1 {
      position: absolute;
      top: 10px;
      left: 30px;
      color: var(--color1);
      font-size: 2em;
      z-index: 2;
    }
  }

  #song-area {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .sub-block {
      position: relative;
      width: calc(50% - 10px);
      height: 100%;
    }

    .player-area {
    }

    .title {
      border-bottom: 1px solid #ccc;
      padding-bottom: 10px;
    }

    .current-song {
      width: 100%;
      height: calc(100% - 1.5em - 0.8em - 20px);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      gap: 5px;

      .line {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-size: 0.8em;
      }
    }

    #none-song {
      width: 100%;
      height: 100%;
      background-color: #ccc;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        width: 60px;
        height: 60px;
        fill: #aaa;
      }
    }
  }

  #main-viewport {
    position: absolute;
    bottom: 0;
    left: 50%;
    width: calc(100% - 40px);
    max-width: 900px;
    height: calc(100% - 170px);
    margin: 20px;
    transform: translateX(calc(-50% - 20px));

    .block {
      position: relative;
      width: 100%;
      padding: 20px;
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 0 6px #555;
    }

    .controller {
      top: 0;
      left: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
    }

    .infomation {
      position: absolute;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-direction: column;
      width: 100%;
      bottom: 0;
      left: 0;
      height: calc(100% - 100px);

      .title {
        color: var(--color1);
        font-size: 1.5em;
        width: 100%;
        margin-bottom: 5px;
      }

      .info-area:nth-child(1) {
        width: 100%;
        height: calc(45% - 10px);
      }
      .info-area:nth-child(2) {
        width: 100%;
        height: calc(55% - 10px);
      }
    }
  }

  #playlist-area {
    .title-area {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;

      .title {
        margin-top: 10px;
        width: max-content !important;
      }
    }

    .playlist-table-scrollbox {
      height: calc(100% - 1.5em - 5px - 0.8em - 50px);
      max-height: calc(100% - 1.5em - 5px - 0.8em - 50px);
      overflow-y: auto;
    }

    .playlist-table {
      position: relative;
      width: 100%;
      border-collapse: collapse;

      thead tr {
        border-bottom: 1px solid #ccc;
      }
      tbody tr {
        border-bottom: 1px solid #ebebeb;
      }

      th {
        color: #666;
        padding-bottom: 10px;
        margin-bottom: 20px;
        font-size: 0.6em;
      }

      td {
        font-size: 0.8em;
        padding: 5px 0;
      }

      th,
      td {
        text-align: center;
      }

      .playlist-thumbnail {
        height: 50px;
      }

      .song-setting-btn {
        position: relative;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 18px;
        height: 18px;
        border: 1px solid #ccc;
        border-radius: 2px;
        vertical-align: middle;

        .icon {
          width: 14px;
          height: 14px;
          fill: #aaa;
          transition: 0.1s;
        }
      }
      .song-setting-btn:hover {
        cursor: pointer;
        box-shadow: 0 0 3px #ccc;

        .icon {
          fill: var(--color1);
        }
      }
    }
  }
</style>
