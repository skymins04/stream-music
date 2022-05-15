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
  import Popup from "../common/Popup.svelte";

  let ytURL: string;
  let ytSearchID: string = "";
  let ytPlayer: any = null;

  /**
   * 재생 대기열에 ytSearchID에 해당하는 YouTube 영상 정보를 추가하는 함수
   */
  const addQueueYT = () => {
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

<Popup popupFlag={FLAG_YT_SEARCH_POPUP}>
  <div class="viewport-title">유튜브 주소로 추가</div>
  <div class="frm-input">
    <input
      type="text"
      placeholder="ex) https://www.youtube.com/watch?v=-Y9VtoPvtuM"
      bind:value={ytURL}
    />
    <button on:click={addQueueYT}>추가</button>
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
    }

    button {
      font-size: 0.7em;
      height: 3em;
      padding: 0 1.5em;
    }
  }
</style>
