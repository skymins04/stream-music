<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { ToastContainer, FlatToast } from "svelte-toasts";
  import axios from "axios";
  import Clipboard from "svelte-clipboard";

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
  import LocalSearch from "./LocalSearch.svelte";
  import LocalPlayer from "./LocalPlayer.svelte";

  import { errorToast, infoToast, successToast } from "../common/toast";
  import {
    FLAG_YT_SEARCH_POPUP,
    FLAG_LOADING_SCREEN_SAVER,
    FLAG_HISTORY_LIST,
    FLAG_NETWORK_STATUS,
    FLAG_CLIENT_STATUS,
    FLAG_LOCAL_SEARCH_POPUP,
    YT_VIDEO_ID,
    LOCAL_SONG_PATH,
    FLAG_PAGE_IS_LOADING,
    FLAG_PROTECTOR,
    PROTECTOR_CONTENT,
    PLAYLIST,
    USER,
    FLAG_PAGE_SELECTER,
    API_SERVER,
    WEBRTC_PEER,
  } from "../common/stores";
  import { RTCPeerPlayer } from "../common/rtcPeerPlayer";

  import "./preSetup";
  import { sendPlaylistToClient } from "../common/functions";

  let profileMenuToggle = false;

  // 실수로 페이지를 빠져나가는 것을 방지
  window.addEventListener("beforeunload", (event) => {
    if ($FLAG_PAGE_SELECTER === 1) {
      event.preventDefault();
      event.returnValue = "";
      axios.post(
        `${
          window.location.toString().split("://")[0]
        }://${$API_SERVER}/.netlify/functions/state`,
        JSON.stringify({
          type: "player",
          channelId: $USER.channelId,
          state: false,
        })
      );
    }
  });

  onMount(() => {
    const agent = window.navigator.userAgent.toLowerCase();
    if (agent.indexOf("mobile") !== -1) {
      FLAG_PROTECTOR.set(true);
      PROTECTOR_CONTENT.set("모바일은 지원하지 않습니다.");
    }
    setTimeout(() => {
      FLAG_PAGE_IS_LOADING.set(false);
      document.querySelector(".protector.loading")?.remove();
      document.getElementById("mainlanding-page")?.remove();
      WEBRTC_PEER.set(
        new RTCPeerPlayer(
          $USER?.channelId as string,
          (msg) => {
            alert(msg);
          },
          FLAG_CLIENT_STATUS
        )
      );
      $WEBRTC_PEER.connectP2PSession(
        () => {
          sendPlaylistToClient();
          infoToast("클라이언트가 연결되었습니다.");
        },
        () => {
          errorToast("클라이언트 연결 timeout");
        }
      );
    }, 2000);
  });

  onDestroy(() => {});
</script>

<Protector>
  <div id="player-app">
    <ToastContainer let:data>
      <FlatToast {data} />
    </ToastContainer>

    {#if $FLAG_LOADING_SCREEN_SAVER}
      <LoadingScreenSaver />
    {/if}
    {#if $FLAG_YT_SEARCH_POPUP}
      <YtSearch />
    {/if}
    {#if $FLAG_LOCAL_SEARCH_POPUP}
      <LocalSearch />
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
          <span>클라이언트 연결상태</span>
          <span>
            <Indicator state={$FLAG_CLIENT_STATUS} />
          </span>
        </span>
        <img
          src={$USER?.imageURL}
          on:click={() => {
            profileMenuToggle = !profileMenuToggle;
          }}
          alt=""
        />
        {#if profileMenuToggle}
          <div class="profile-menu" transition:fade>
            <div
              class="menu"
              on:click={() => {
                google.accounts.id.disableAutoSelect();
                FLAG_PAGE_IS_LOADING.set(true);
                setTimeout(() => {
                  axios
                    .post(
                      `${
                        window.location.toString().split("://")[0]
                      }://${$API_SERVER}/.netlify/functions/state`,
                      JSON.stringify({
                        type: "player",
                        channelId: $USER.channelId,
                        state: false,
                      })
                    )
                    .then(() => {
                      FLAG_PAGE_SELECTER.set(0);
                      window.location.reload();
                    });
                }, 1000);
              }}
            >
              로그아웃
            </div>
          </div>
        {/if}
      </div>
    </div>

    <div id="main-viewport">
      <div class="block controller">
        <SongControl />
        <div class="btns">
          <div class="btns">
            <Clipboard
              let:copy
              on:copy={() => {
                infoToast("클라이언트 링크가 복사되었습니다.");
              }}
              text={`${window.location.href.split("://")[0]}://${
                window.location.href.split("://")[1].split("/")[0]
              }/#/client/${$USER.channelId}`}
            >
              <Btn
                defaultLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"/></svg> 링크복사`}
                minLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"/></svg>`}
                tooltip={"링크복사"}
                onClick={copy}
              />
            </Clipboard>
            <Btn
              defaultLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg> 설정`}
              minLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M495.9 166.6C499.2 175.2 496.4 184.9 489.6 191.2L446.3 230.6C447.4 238.9 448 247.4 448 256C448 264.6 447.4 273.1 446.3 281.4L489.6 320.8C496.4 327.1 499.2 336.8 495.9 345.4C491.5 357.3 486.2 368.8 480.2 379.7L475.5 387.8C468.9 398.8 461.5 409.2 453.4 419.1C447.4 426.2 437.7 428.7 428.9 425.9L373.2 408.1C359.8 418.4 344.1 427 329.2 433.6L316.7 490.7C314.7 499.7 307.7 506.1 298.5 508.5C284.7 510.8 270.5 512 255.1 512C241.5 512 227.3 510.8 213.5 508.5C204.3 506.1 197.3 499.7 195.3 490.7L182.8 433.6C167 427 152.2 418.4 138.8 408.1L83.14 425.9C74.3 428.7 64.55 426.2 58.63 419.1C50.52 409.2 43.12 398.8 36.52 387.8L31.84 379.7C25.77 368.8 20.49 357.3 16.06 345.4C12.82 336.8 15.55 327.1 22.41 320.8L65.67 281.4C64.57 273.1 64 264.6 64 256C64 247.4 64.57 238.9 65.67 230.6L22.41 191.2C15.55 184.9 12.82 175.3 16.06 166.6C20.49 154.7 25.78 143.2 31.84 132.3L36.51 124.2C43.12 113.2 50.52 102.8 58.63 92.95C64.55 85.8 74.3 83.32 83.14 86.14L138.8 103.9C152.2 93.56 167 84.96 182.8 78.43L195.3 21.33C197.3 12.25 204.3 5.04 213.5 3.51C227.3 1.201 241.5 0 256 0C270.5 0 284.7 1.201 298.5 3.51C307.7 5.04 314.7 12.25 316.7 21.33L329.2 78.43C344.1 84.96 359.8 93.56 373.2 103.9L428.9 86.14C437.7 83.32 447.4 85.8 453.4 92.95C461.5 102.8 468.9 113.2 475.5 124.2L480.2 132.3C486.2 143.2 491.5 154.7 495.9 166.6V166.6zM256 336C300.2 336 336 300.2 336 255.1C336 211.8 300.2 175.1 256 175.1C211.8 175.1 176 211.8 176 255.1C176 300.2 211.8 336 256 336z"/></svg>`}
              tooltip={"설정"}
              onClick={() => {
                infoToast("현재 서비스 준비중입니다!");
                // console.log($PLAYLIST, $LOCAL_SONG_PATH);
                $WEBRTC_PEER.sendMessage("test Message hahaha!");
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
            {:else if $LOCAL_SONG_PATH != ""}
              <LocalPlayer />
            {:else}
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
                defaultLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg> YouTube 음원 추가`}
                minLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg> 추가`}
                tooltip={"유튜브 음원 추가"}
                onClick={() => {
                  FLAG_YT_SEARCH_POPUP.set(true);
                }}
              />
              <Btn
                defaultLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM176 404c0 10.75-12.88 15.98-20.5 8.484L120 376H76C69.38 376 64 370.6 64 364v-56C64 301.4 69.38 296 76 296H120l35.5-36.5C163.1 251.9 176 257.3 176 268V404zM224 387.8c-4.391 0-8.75-1.835-11.91-5.367c-5.906-6.594-5.359-16.69 1.219-22.59C220.2 353.7 224 345.2 224 336s-3.797-17.69-10.69-23.88c-6.578-5.906-7.125-16-1.219-22.59c5.922-6.594 16.05-7.094 22.59-1.219C248.2 300.5 256 317.8 256 336s-7.766 35.53-21.31 47.69C231.6 386.4 227.8 387.8 224 387.8zM320 336c0 41.81-20.5 81.11-54.84 105.1c-2.781 1.938-5.988 2.875-9.145 2.875c-5.047 0-10.03-2.375-13.14-6.844c-5.047-7.25-3.281-17.22 3.969-22.28C272.6 396.9 288 367.4 288 336s-15.38-60.84-41.14-78.8c-7.25-5.062-9.027-15.03-3.98-22.28c5.047-7.281 14.99-9.062 22.27-3.969C299.5 254.9 320 294.2 320 336zM256 0v128h128L256 0z"/></svg> 로컬 음원파일 추가`}
                minLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM176 404c0 10.75-12.88 15.98-20.5 8.484L120 376H76C69.38 376 64 370.6 64 364v-56C64 301.4 69.38 296 76 296H120l35.5-36.5C163.1 251.9 176 257.3 176 268V404zM224 387.8c-4.391 0-8.75-1.835-11.91-5.367c-5.906-6.594-5.359-16.69 1.219-22.59C220.2 353.7 224 345.2 224 336s-3.797-17.69-10.69-23.88c-6.578-5.906-7.125-16-1.219-22.59c5.922-6.594 16.05-7.094 22.59-1.219C248.2 300.5 256 317.8 256 336s-7.766 35.53-21.31 47.69C231.6 386.4 227.8 387.8 224 387.8zM320 336c0 41.81-20.5 81.11-54.84 105.1c-2.781 1.938-5.988 2.875-9.145 2.875c-5.047 0-10.03-2.375-13.14-6.844c-5.047-7.25-3.281-17.22 3.969-22.28C272.6 396.9 288 367.4 288 336s-15.38-60.84-41.14-78.8c-7.25-5.062-9.027-15.03-3.98-22.28c5.047-7.281 14.99-9.062 22.27-3.969C299.5 254.9 320 294.2 320 336zM256 0v128h128L256 0z"/></svg> 추가`}
                tooltip={"로컬 음원파일 추가"}
                onClick={() => {
                  FLAG_LOCAL_SEARCH_POPUP.set(true);
                }}
              />
              <Btn
                defaultLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; margin-right: .2em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C201.7 512 151.2 495 109.7 466.1C95.2 455.1 91.64 436 101.8 421.5C111.9 407 131.8 403.5 146.3 413.6C177.4 435.3 215.2 448 256 448C362 448 448 362 448 256C448 149.1 362 64 256 64C202.1 64 155 85.46 120.2 120.2L151 151C166.1 166.1 155.4 192 134.1 192H24C10.75 192 0 181.3 0 168V57.94C0 36.56 25.85 25.85 40.97 40.97L74.98 74.98C121.3 28.69 185.3 0 255.1 0L256 0zM256 128C269.3 128 280 138.7 280 152V246.1L344.1 311C354.3 320.4 354.3 335.6 344.1 344.1C335.6 354.3 320.4 354.3 311 344.1L239 272.1C234.5 268.5 232 262.4 232 256V152C232 138.7 242.7 128 256 128V128z"/></svg> 히스토리`}
                minLabel={`<svg style="position: relative; top: .1em; width: 1em; height: 1em; fill: white;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C201.7 512 151.2 495 109.7 466.1C95.2 455.1 91.64 436 101.8 421.5C111.9 407 131.8 403.5 146.3 413.6C177.4 435.3 215.2 448 256 448C362 448 448 362 448 256C448 149.1 362 64 256 64C202.1 64 155 85.46 120.2 120.2L151 151C166.1 166.1 155.4 192 134.1 192H24C10.75 192 0 181.3 0 168V57.94C0 36.56 25.85 25.85 40.97 40.97L74.98 74.98C121.3 28.69 185.3 0 255.1 0L256 0zM256 128C269.3 128 280 138.7 280 152V246.1L344.1 311C354.3 320.4 354.3 335.6 344.1 344.1C335.6 354.3 320.4 354.3 311 344.1L239 272.1C234.5 268.5 232 262.4 232 256V152C232 138.7 242.7 128 256 128V128z"/></svg>`}
                tooltip={"히스토리"}
                onClick={() => {
                  FLAG_HISTORY_LIST.set(true);
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
  </div>
</Protector>

<style lang="scss">
  @keyframes intro {
    from {
      bottom: -50px;
      opacity: 0;
    }
    to {
      bottom: 0;
      opacity: 1;
    }
  }

  .btns {
    position: relative;
    max-width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: nowrap;
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

    .connection-indicators {
      padding-right: 40px;

      img {
        position: absolute;
        top: 50%;
        right: -10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: #ccc;
        transform: translateY(-50%);
      }
      img:hover {
        cursor: pointer;
      }

      .profile-menu {
        position: absolute;
        right: -10px;
        bottom: -3.6em;
        width: 150px;
        border: 1px solid rgb(246, 246, 246);
        border-radius: 10px;
        background-color: white;
        box-shadow: 0 0 5px #555;

        .menu {
          width: 100%;
          padding: 1em;
          font-size: 0.8em;
          font-weight: 400;
          border-radius: 10px;
          color: #555;
          transition: 0.2s;
        }
        .menu:hover {
          cursor: pointer;
          background-color: #eee;
        }
      }
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
    animation: intro 1s ease-in-out;

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
        margin-bottom: 10px;
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
