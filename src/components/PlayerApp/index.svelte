<script lang="ts">
  import { ToastContainer, FlatToast } from "svelte-toasts";

  import LoadingScreenSaver from "../common/LoadingScreenSaver.svelte";
  import Btn from "../common/Btn.svelte";
  import Indicator from "../common/Indicator.svelte";
  import Protector from "../common/Protector.svelte";

  import SongControl from "./SongControl.svelte";
  import PlayListTable from "./PlayListTable.svelte";
  import HistoryList from "./HistoryList.svelte";
  import NowPlaying from "./NowPlaying.svelte";
  import YtSearch from "./YTSearch.svelte";
  import YtPlayer from "./YTPlayer.svelte";

  import { infoToast } from "../common/toast";
  import {
    FLAG_YT_SEARCH_POPUP,
    FLAG_LOADING_SCREEN_SAVER,
    FLAG_HISTORY_LIST,
    FLAG_NETWORK_STATUS,
    FLAG_CLIENT_STATUS,
    YT_VIDEO_ID,
    LOCAL_SONG_PATH,
  } from "../common/stores";

  import "./protectionLogic";
</script>

<Protector>
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
    <div class="connection-indicators">
      <span class="indicator">
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 512"
          ><path
            d="M319.1 351.1c-35.35 0-64 28.66-64 64.01s28.66 64.01 64 64.01c35.34 0 64-28.66 64-64.01S355.3 351.1 319.1 351.1zM320 191.1c-70.25 0-137.9 25.6-190.5 72.03C116.3 275.7 115 295.9 126.7 309.2C138.5 322.4 158.7 323.7 171.9 312C212.8 275.9 265.4 256 320 256s107.3 19.88 148.1 56C474.2 317.4 481.8 320 489.3 320c8.844 0 17.66-3.656 24-10.81C525 295.9 523.8 275.7 510.5 264C457.9 217.6 390.3 191.1 320 191.1zM630.2 156.7C546.3 76.28 436.2 32 320 32S93.69 76.28 9.844 156.7c-12.75 12.25-13.16 32.5-.9375 45.25c12.22 12.78 32.47 13.12 45.25 .9375C125.1 133.1 220.4 96 320 96s193.1 37.97 265.8 106.9C592.1 208.8 600 211.8 608 211.8c8.406 0 16.81-3.281 23.09-9.844C643.3 189.2 642.9 168.1 630.2 156.7z"
          /></svg
        >
        <span>네트워크 연결상태</span>
        <span>
          <Indicator state={$FLAG_NETWORK_STATUS} />
        </span>
      </span>
      <span class="indicator">
        <svg
          class="icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 576 512"
          ><path
            d="M528 0h-480C21.5 0 0 21.5 0 48v320C0 394.5 21.5 416 48 416h192L224 464H152C138.8 464 128 474.8 128 488S138.8 512 152 512h272c13.25 0 24-10.75 24-24s-10.75-24-24-24H352L336 416h192c26.5 0 48-21.5 48-48v-320C576 21.5 554.5 0 528 0zM512 288H64V64h448V288z"
          /></svg
        >
        <span>STREAM-MUSIC 클라이언트 연결상태</span>
        <span>
          <Indicator state={$FLAG_CLIENT_STATUS} />
        </span>
      </span>
    </div>
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
            <YtPlayer />
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
</Protector>

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
        text-align: center;
      }
    }
  }
</style>
