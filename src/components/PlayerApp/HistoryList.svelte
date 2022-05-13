<script lang="ts">
  import { fly, fade } from "svelte/transition";

  import { FLAG_HISTORY_LIST, PLAYLIST } from "../common/stores";
  import { savePlayList } from "../common/functions";
  import { infoToast, successToast } from "../common/toast";
  import EmptyCover from "../common/EmptyCover.svelte";

  const delHistorySong = (index: number) => {
    if (confirm("플레이리스트에서 해당 재생 기록을 제거하시겠습니까?")) {
      $PLAYLIST.history.splice(index, 1);
      savePlayList();
      infoToast("재생기록을 제거했습니다.");
    }
  };

  const addSongToPlaylist = (index: number) => {
    $PLAYLIST.queue.push($PLAYLIST.history[index]);
    savePlayList();
    successToast("플레이리스트에 추가되었습니다.");
  };
</script>

{#if $FLAG_HISTORY_LIST}
  <div
    id="history-list-screensaver"
    on:click={() => {
      FLAG_HISTORY_LIST.set(false);
    }}
  />
  <div id="history-list-area" transition:fly={{ x: 300, duration: 500 }}>
    <div class="title-area">
      <div class="title">
        History<span class="subtitle">최근 재생 기록(최대 50개까지)</span>
      </div>
      <div
        class="exit-btn"
        on:click={() => {
          FLAG_HISTORY_LIST.set(false);
        }}
      />
    </div>

    <div class="list">
      {#if $PLAYLIST.history.length != 0}
        {#each $PLAYLIST.history as song, i}
          <div class="song">
            <div class="line">{song.title}</div>
            <div class="line">{song.artist}</div>
            <div
              class="del-btn"
              on:click={() => {
                delHistorySong(i);
              }}
            />
            <div
              class="add-btn"
              on:click={() => {
                addSongToPlaylist(i);
              }}
            />
          </div>
        {/each}
      {:else}
        <EmptyCover
          height={"100%"}
          msg={"재생 기록이 없습니다."}
          color={"#fff"}
        />
      {/if}
    </div>
  </div>
{/if}

<style lang="scss">
  #history-list-screensaver {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 10;
  }

  #history-list-area {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 100%;
    padding-top: 50px;
    padding-bottom: 20px;
    background-color: var(--color3);
    z-index: 10;

    .title-area {
      position: absolute;
      top: 10px;
      left: 0;
      width: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        color: white;
        font-size: 1.5em;

        .subtitle {
          display: block;
          font-size: 0.5em;
          margin-top: 0.5em;
        }
      }

      .exit-btn {
        position: relative;
        width: 20px;
        height: 20px;
        margin-top: 5px;
      }

      .exit-btn:hover {
        cursor: pointer;
      }
      .exit-btn:hover::before,
      .exit-btn:hover::after {
        background-color: var(--color4) !important;
      }

      .exit-btn::after {
        content: "";
        display: block;
        background-color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 2px;
        transform: translate(-50%, -50%) rotate(45deg);
        transition: 0.1s;
      }

      .exit-btn::before {
        content: "";
        display: block;
        background-color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 2px;
        transform: translate(-50%, -50%) rotate(-45deg);
        transition: 0.1s;
      }
    }

    .list {
      width: 100%;
      height: 100%;
      padding-top: 20px;
      overflow-y: auto;
      -webkit-mask-image: -webkit-gradient(
        linear,
        left bottom,
        left top,
        from(rgba(0, 0, 0, 1)),
        color-stop(0.95, rgba(0, 0, 0, 1)),
        to(rgba(0, 0, 0, 0))
      );

      .song {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        gap: 5px;
        width: calc(100% - 40px);
        height: 90px;
        margin: 20px 20px 0 20px;
        padding: 20px;
        border-radius: 10px;
        background-color: white;
        box-shadow: 0 0 5px #555;

        .line {
          font-size: 0.8em;
        }
        .line:first-child {
          font-weight: 400;
        }

        .del-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 10px;
          height: 10px;
        }
        .del-btn::before {
          content: "";
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 2px;
          background-color: #aaa;
          transform: translate(-50%, -50%) rotate(45deg);
        }
        .del-btn::after {
          content: "";
          display: block;
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 2px;
          background-color: #aaa;
          transform: translate(-50%, -50%) rotate(-45deg);
        }
        .del-btn:hover {
          cursor: pointer;
        }
        .del-btn:hover::before,
        .del-btn:hover::after {
          background-color: #555;
        }

        .add-btn {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: max-content;
          padding: 3px 5px;
          font-size: 0.5em;
          color: #555;
          background-color: white;
          border: 1px solid #ccc;
          border-radius: 3px;
          white-space: nowrap;
          transition: 0.2s;
          opacity: 0;
        }
        .add-btn::before {
          content: "+ PlayList에 추가";
        }
      }

      .song:hover {
        .add-btn {
          opacity: 1;
        }

        .add-btn:hover {
          cursor: pointer;
          background-color: var(--color1);
          color: white;
          border: 1px solid var(--color2);
        }
      }
    }
  }
</style>
