<script lang="ts">
  import { fly } from "svelte/transition";

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
            <div class="line">
              {#if song.type === "youtube"}
                <svg
                  class="icon youtube"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                  ><path
                    d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                  /></svg
                >
                <svg
                  class="icon common"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  ><path
                    d="M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"
                  /></svg
                >
                <a
                  href="https://www.youtube.com/watch?v={song.songId}"
                  target="_blank"
                  rel="noopener noreferrer">{song.title}</a
                >
              {:else if song.type === "local"}
                <svg
                  class="icon common"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                  ><path
                    d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM176 404c0 10.75-12.88 15.98-20.5 8.484L120 376H76C69.38 376 64 370.6 64 364v-56C64 301.4 69.38 296 76 296H120l35.5-36.5C163.1 251.9 176 257.3 176 268V404zM224 387.8c-4.391 0-8.75-1.835-11.91-5.367c-5.906-6.594-5.359-16.69 1.219-22.59C220.2 353.7 224 345.2 224 336s-3.797-17.69-10.69-23.88c-6.578-5.906-7.125-16-1.219-22.59c5.922-6.594 16.05-7.094 22.59-1.219C248.2 300.5 256 317.8 256 336s-7.766 35.53-21.31 47.69C231.6 386.4 227.8 387.8 224 387.8zM320 336c0 41.81-20.5 81.11-54.84 105.1c-2.781 1.938-5.988 2.875-9.145 2.875c-5.047 0-10.03-2.375-13.14-6.844c-5.047-7.25-3.281-17.22 3.969-22.28C272.6 396.9 288 367.4 288 336s-15.38-60.84-41.14-78.8c-7.25-5.062-9.027-15.03-3.98-22.28c5.047-7.281 14.99-9.062 22.27-3.969C299.5 254.9 320 294.2 320 336zM256 0v128h128L256 0z"
                  /></svg
                >
                {song.title}
              {/if}
            </div>
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

          .icon {
            position: relative;
            top: 0.1em;
            display: inline;
            width: 1em;
            height: 1em;
            margin-right: 0.2em;
            fill: #ccc;
            transition: 0.2s;
          }
        }
        .line:first-child * {
          font-weight: 400;
          color: black;
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
          border-radius: 6px;
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

        .icon.youtube {
          fill: #ff0000;
        }

        .icon.common {
          fill: #555;
        }
      }
    }
  }
</style>
