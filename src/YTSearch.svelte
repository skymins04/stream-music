<script lang="ts">
  import {
    FLAG_LOADING_SCREEN_SAVER,
    FLAG_YT_SEARCH_POPUP,
    LOADING_SCREEN_SAVER_MSG,
    PLAYLIST,
    savePlayList,
  } from "./stores";
  import { errorToast, successToast } from "./toast";
  import YouTube from "svelte-youtube";

  let ytURL: string;
  let ytSearchID: string;
  let ytPlyaer: any;

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
      ytPlyaer.mute();
      ytPlyaer.playVideo();
    }, 1000);
  };

  const getDurationNumToStr = (sec: number) => {
    const M = Math.floor(sec / 60);
    const S = sec - M * 60;

    const durationM = String(M).padStart(2, "0");
    const durationS = String(S).padStart(2, "0");

    return `${durationM}:${durationS}`;
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
          placeholder="유튜브 영상 주소를 입력하세요"
          bind:value={ytURL}
        />
        <button on:click={addQueueYT}>추가</button>
      </div>
    </div>
    <div class="displaynone">
      <YouTube
        videoId={ytSearchID}
        on:ready={(event) => {
          ytPlyaer = event.detail.target;
        }}
        on:play={() => {
          ytPlyaer.pauseVideo();
          const data = ytPlyaer.getVideoData();
          const durationSec = Math.ceil(ytPlyaer.getDuration());
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
          successToast("재생대기열에 추가되었습니다!");
        }}
      />
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
        input {
          width: calc(100% - 7em) !important;
          min-width: 18em;
        }
      }
    }
  }

  #yt-search-results {
    width: 100%;
    height: 320px;
    margin-top: 20px;
    overflow-y: scroll;

    #yt-search-result {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      height: 120px;
      margin-bottom: 10px;

      .thumb,
      img {
        height: 100%;
      }

      .info {
        height: 100%;
        padding-left: 10px;

        .title {
          font-weight: bolder;
          font-size: 1.2em;
          color: black;
        }
        .upload-date,
        .desc {
          color: #666;
          font-size: 0.8em;
        }

        .upload-date {
          margin-bottom: 10px;
        }
      }
    }
  }
</style>
