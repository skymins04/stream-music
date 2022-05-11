<script lang="ts">
  import YtSearch from "./YTSearch.svelte";
  import YouTube from "svelte-youtube";
  import LoadingScreenSaver from "./LoadingScreenSaver.svelte";
  import SongControl from "./SongControl.svelte";
  import { ToastContainer, FlatToast } from "svelte-toasts";
  import { successToast, infoToast } from "./toast";

  import {
    FLAG_YT_SEARCH_POPUP,
    FLAG_LOADING_SCREEN_SAVER,
    FLAG_PLAYER_IS_READY,
    FLAG_PLAYING,
    YT_VIDEO_ID,
    LOCAL_SONG_PATH,
    PLAYLIST,
    Song,
    savePlayList,
    PLAYER_ELEMENT,
    fowardSong,
    stopSong,
  } from "./stores";

  // 실수로 페이지를 빠져나가는 것을 방지
  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = "";
  });

  /**
   * 재생 대기열 내 노래의 순번을 변경하는 함수
   * @param n 변경할 노래의 인덱스 번호
   * @param offset 순번 변경 오프셋, 1: UP, -1: DOWN
   */
  const songUpDown = (n: number, offset: number = 1) => {
    if (
      (n > 0 && offset === 1) ||
      ($PLAYLIST.queue.length - 1 !== n && offset === -1)
    ) {
      const songA: Song = $PLAYLIST.queue[n];
      const songB: Song = $PLAYLIST.queue[n - 1 * offset];
      $PLAYLIST.queue[n] = songB;
      $PLAYLIST.queue[n - 1 * offset] = songA;
      savePlayList();
    }
  };

  /**
   * 재생 대기열 내 노래를 제거하는 함수
   * @param n 제거할 노래의 인덱스 번호
   */
  const songDel = (n: number) => {
    if (n >= 0 && n <= $PLAYLIST.queue.length - 1) {
      if (confirm("정말 재생대기열에서 삭제하시겠습니까?")) {
        $PLAYLIST.queue.pop(n);
        savePlayList();
        successToast("노래를 재생대기열에서 삭제했습니다.");
      }
    }
  };

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
      if ($PLAYLIST.queue.length !== 0) fowardSong($FLAG_PLAYING);
      else stopSong();
    } else if (event.detail.data === 1) {
      // is playing
      FLAG_PLAYING.set(true);
    } else if (event.detail.data === 2) {
      // paused
      FLAG_PLAYING.set(false);
    } else if (event.detail.data === 5) {
      // video on ready
      if ($FLAG_PLAYING) $PLAYER_ELEMENT.playVideo();
      FLAG_PLAYER_IS_READY.set(true);
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
        <div class="title">현재재생곡</div>
        {#if $PLAYLIST.currentSong !== null}
          <div class="current-song">
            <span class="line"
              >- TITLE: <span class="bold">{$PLAYLIST.currentSong.title}</span
              ></span
            >
            <span class="line">
              - ARTIST: <span class="bold">{$PLAYLIST.currentSong.artist}</span>
            </span>
            <span class="line">
              - DURATION: <span class="bold"
                >{$PLAYLIST.currentSong.duration}</span
              >
            </span>
            {#if $PLAYLIST.currentSong.type === "youtube"}
              <span class="line">
                <a
                  target="_blank"
                  href="https://youtube.com/watch?v={$PLAYLIST.currentSong
                    .songId}"
                  >https://youtube.com/watch?v={$PLAYLIST.currentSong.songId}</a
                >
              </span>
            {/if}
          </div>
        {:else}
          <div class="current-song-null">현재 재생중인 곡이 없습니다.</div>
        {/if}
      </div>
    </div>
    <div class="block info-area" id="playlist-area">
      <div class="title">재생대기열</div>
      <table class="playlist-table">
        <colgroup>
          <col width="20px" />
          <col />
          <col width="150px" />
          <col width="70px" />
          <col width="70px" />
          <col width="100px" />
        </colgroup>
        <thead>
          <tr>
            <th />
            <th>TITLE</th>
            <th>ARTIST</th>
            <th>PLATFORM</th>
            <th>DURATION</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
      </table>
      <div class="playlist-table-scrollbox">
        <table class="playlist-table">
          <colgroup>
            <col width="20px" />
            <col />
            <col width="150px" />
            <col width="70px" />
            <col width="70px" />
            <col width="100px" />
          </colgroup>
          <tbody>
            {#each $PLAYLIST.queue as song, i}
              <tr>
                <td>{i + 1}</td>
                <td>{song.title}</td>
                <td>{song.artist}</td>
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
        font-size: 0.8em;

        .bold {
          font-weight: 400;
          margin-left: 1em;
        }
      }
    }

    .current-song-null {
      width: 100%;
      height: calc(100% - 1.5em - 0.8em - 20px);
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;
      font-size: 0.8em;
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
