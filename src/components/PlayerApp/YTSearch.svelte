<script lang="ts">
  import YouTube from "svelte-youtube";

  import { errorToast, successToast } from "../common/toast";
  import {
    FLAG_LOADING_SCREEN_SAVER,
    FLAG_YT_SEARCH_POPUP,
    LOADING_SCREEN_SAVER_MSG,
    PLAYLIST,
  } from "../common/stores";
  import { savePlayList, getDurationNumToStr } from "../common/functions";

  let ytURL: string;
  let ytSearchID: string = "";
  let ytPlayer: any = null;

  /**
   * 재생 대기열에 ytSearchID에 해당하는 YouTube 영상 정보를 추가하는 함수
   */
  const addQueueYT = async () => {
    const ytURLRegExp =
      /^(http:|https:)?(\/\/)?(www\.)?(youtube.com|youtu.be)\/(watch|embed)?(\?v=|\/)?(\S+)?$/g;
    const songIdRegExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const songIdMatch = ytURL.match(songIdRegExp);

    if (
      !ytURLRegExp.test(ytURL) ||
      !songIdMatch ||
      songIdMatch[7].length !== 11
    ) {
      errorToast("입력한 유튜브 주소가 유효하지 않습니다.");
      return;
    }

    ytSearchID = songIdMatch[7];

    LOADING_SCREEN_SAVER_MSG.set("재생대기열에 추가 중...");
    FLAG_LOADING_SCREEN_SAVER.set(true);

    setTimeout(() => {
      ytPlayer.mute();
      ytPlayer.playVideo();
    }, 1000);
  };

  /**
   * YouTube Player iframe API onReady 함수.
   * onReady 시 ytPlayer에 Player 객체를 가져옴
   * @param event
   */
  const onReadyYoutubePlayer = (event) => {
    ytPlayer = event.detail.target;
  };

  /**
   * YouTube Player iframe API onStateChange 함수.
   * 재생준비완료상태(5)가 되면 Player를 음소거한 후 재생시킨 뒤,
   * 재생상태(1)가 되면 일시정지 한 후 해당 영상 정보를 재생대기열에 추가시킴.
   * @param event
   */
  const onStateChangeYoutubePlayer = (event) => {
    if (event.detail.data === 1) {
      ytPlayer.pauseVideo();
      const data = ytPlayer.getVideoData();
      const durationSec = Math.ceil(ytPlayer.getDuration());
      $PLAYLIST.queue.push({
        type: "youtube",
        songId: ytSearchID,
        title: data.title,
        artist: data.author,
        duration: getDurationNumToStr(durationSec),
      });
      savePlayList();
      FLAG_LOADING_SCREEN_SAVER.set(false);
      LOADING_SCREEN_SAVER_MSG.set("");
      FLAG_YT_SEARCH_POPUP.set(false);
      successToast("플레이리스트에 추가되었습니다.");
      ytPlayer = null;
      ytSearchID = "";
    } else if (event.detail.data === 5) {
      ytPlayer.mute();
      ytPlayer.playVideo();
    }
  };
</script>

<div id="yt-search-popup">
  <div class="viewport">
    <div
      class="exit-btn"
      on:click={() => {
        FLAG_YT_SEARCH_POPUP.set(false);
      }}
    />
    <div class="interface link">
      <div class="viewport-title">유튜브 주소로 추가</div>
      <div class="frm-input">
        <input
          type="text"
          placeholder="ex) https://www.youtube.com/watch?v=-Y9VtoPvtuM"
          bind:value={ytURL}
        />
        <button on:click={addQueueYT}>추가</button>
      </div>
    </div>
    <div class="displaynone">
      {#if ytSearchID !== ""}
        <YouTube
          videoId={ytSearchID}
          on:ready={onReadyYoutubePlayer}
          on:stateChange={onStateChangeYoutubePlayer}
        />
      {/if}
    </div>
  </div>
</div>

<style lang="scss">
  .displaynone {
    display: none !important;
  }

  #yt-search-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000aa;
    z-index: 1000;

    .viewport {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 90%;
      max-width: 900px;
      height: 150px;
      background-color: white;
      border-radius: 20px;
      box-shadow: 0 0 15px black;
      padding: 50px;
      animation: opacityFadeIn 0.2s ease-in;

      .exit-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 20px;
        height: 20px;
      }
      .exit-btn:hover {
        cursor: pointer;
      }
      .exit-btn::before,
      .exit-btn::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 3px;
        background-color: #333;
      }
      .exit-btn::before {
        transform: translate(-50%, -50%) rotate(45deg);
      }
      .exit-btn::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      .interface {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;

        .viewport-title {
          color: var(--color1);
          font-size: 2em;
          font-weight: 100;
          width: max-content;
          margin-right: 20px;
          margin-bottom: 5px;
        }

        .frm-input {
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
          }

          button {
            font-size: 0.7em;
            height: 3em;
            padding: 0 1.5em;
          }
        }
      }
      .interface.link {
        width: calc(100% - 4em);
        margin-bottom: 5px;
        input {
          width: 100% !important;
          min-width: 13em;
        }
      }
    }
  }
</style>
