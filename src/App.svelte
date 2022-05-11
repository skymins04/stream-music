<script lang="ts">
  import YtSearch from "./YTSearch.svelte";
  import YouTube from "svelte-youtube";
  import LoadingScreenSaver from "./LoadingScreenSaver.svelte";
  import SongControl from "./SongControl.svelte";

  import {
    FLAG_YT_SEARCH_POPUP,
    FLAG_LOADING_SCREEN_SAVER,
    YT_VIDEO_ID,
    PLAYLIST,
    Song,
  } from "./stores";
  import { ToastContainer, FlatToast } from "svelte-toasts";
  import { successToast, infoToast } from "./toast";

  YT_VIDEO_ID.set("13xy-si_o6c");

  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
  });

  const songUpDown = (n: number, offset: number = 1) => {
    if (
      (n > 0 && offset === 1) ||
      ($PLAYLIST.queue.length - 1 !== n && offset === -1)
    ) {
      const songA: Song = $PLAYLIST.queue[n];
      const songB: Song = $PLAYLIST.queue[n - 1 * offset];
      $PLAYLIST.queue[n] = songB;
      $PLAYLIST.queue[n - 1 * offset] = songA;
      PLAYLIST.set($PLAYLIST);
      localStorage.setItem("streamMusicPlayList", JSON.stringify($PLAYLIST));
    }
  };
  const songDel = (n: number) => {
    if (n >= 0 && n <= $PLAYLIST.queue.length - 1) {
      if (confirm("정말 재생대기열에서 삭제하시겠습니까?")) {
        $PLAYLIST.queue.pop(n);
        PLAYLIST.set($PLAYLIST);
        localStorage.setItem("streamMusicPlayList", JSON.stringify($PLAYLIST));
        successToast("노래를 재생대기열에서 삭제했습니다.");
      }
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

<div id="main-header">
  <div class="bg" />
  <h1>STREAM-MUSIC</h1>
</div>

<div id="main-viewport">
  <div class="block controller">
    <SongControl />
    <div class="btns">
      <!-- <div class="title">노래추가</div> -->
      <div class="btns">
        <div
          class="btn"
          on:click={() => {
            FLAG_YT_SEARCH_POPUP.set(!$FLAG_YT_SEARCH_POPUP);
          }}
        >
          YouTube에서 추가
        </div>
        <div
          on:click={() => {
            infoToast("현재 서비스 준비중입니다!");
          }}
          class="btn"
        >
          SoundCloud에서 추가
        </div>
      </div>
      <div class="btns">
        <div
          on:click={() => {
            infoToast("현재 서비스 준비중입니다!");
          }}
          class="btn"
        >
          내 컴퓨터에서 추가
        </div>
        <div
          on:click={() => {
            infoToast("현재 서비스 준비중입니다!");
          }}
          class="btn"
        >
          설정
        </div>
      </div>
    </div>
  </div>

  <div class="infomation">
    <div class="block info-area" id="song-area">
      <div class="sub-block player-area">
        {#if $YT_VIDEO_ID != ""}
          <YouTube videoId={$YT_VIDEO_ID} />
        {/if}
      </div>
      <div class="sub-block">
        <div class="title">현재재생곡</div>
      </div>
    </div>
    <div class="block info-area" id="playlist-area">
      <div class="title">재생대기열</div>
      <table class="playlist-table">
        <colgroup>
          <col width="20px" />
          <col width="80px" />
          <col />
          <col width="100px" />
          <col width="70px" />
          <col width="70px" />
          <col width="70px" />
          <col width="100px" />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th>THUMBNAIL</th>
            <th>TITLE</th>
            <th>ARTIST</th>
            <th>PUBLISH DATE</th>
            <th>PLATFORM</th>
            <th>DURATION</th>
            <th>SETTING</th>
          </tr>
        </thead>
      </table>
      <div class="playlist-table-scrollbox">
        <table class="playlist-table">
          <colgroup>
            <col width="20px" />
            <col width="80px" />
            <col />
            <col width="100px" />
            <col width="70px" />
            <col width="70px" />
            <col width="70px" />
            <col width="100px" />
          </colgroup>
          <tbody>
            {#each $PLAYLIST.queue as song, i}
              <tr>
                <td>{i + 1}</td>
                <td>
                  <img
                    class="playlist-thumbnail"
                    src={song.thumbnails.default.url}
                    alt=""
                  />
                </td>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.publishedAt.split("T")[0]}</td>
                <td>{song.type}</td>
                <td>{song.duration}</td>
                <td>
                  <div
                    class="song-setting-btn song-up"
                    on:click={() => {
                      songUpDown(i);
                    }}
                  >
                    ⬆
                  </div>
                  <div
                    class="song-setting-btn song-down"
                    on:click={() => {
                      songUpDown(i, -1);
                    }}
                  >
                    ⬇
                  </div>
                  <div
                    class="song-setting-btn song-del"
                    on:click={() => {
                      songDel(i);
                    }}
                  >
                    ✕
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
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

    .title {
      color: var(--color1);
      margin-right: 0.5em;
    }
  }

  .btn {
    white-space: nowrap;
    padding: 0.5em 1em;
    border: 1px solid var(--color2);
    border-radius: 8px;
    background-color: var(--color1);
    font-size: 0.8em;
    color: white;
    transition: 0.1s;
  }
  .btn:hover {
    cursor: pointer;
    background-color: var(--color2);
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
    .playlist-table-scrollbox {
      max-height: calc(100% - 1.5em - 5px - 0.8em - 30px);
      overflow-y: scroll;
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
        transition: 0.1s;
        vertical-align: middle;
        color: #aaa;
      }
      .song-del {
        padding-bottom: 3px;
      }
      .song-setting-btn:hover {
        cursor: pointer;
        box-shadow: 0 0 3px #ccc;
        color: var(--color1);
      }
    }
  }
</style>
