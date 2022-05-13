<script lang="ts">
  import { fly } from "svelte/transition";

  import { FLAG_HISTORY_LIST, PLAYLIST } from "../common/stores";

  console.log($PLAYLIST.history);
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
        {#each $PLAYLIST.history as song}
          <div class="song">
            <div class="line">{song.title}</div>
            <div class="line">{song.artist}</div>
            <div class="line">{song.duration}</div>
            <div class="line">{song.type}</div>
          </div>
        {/each}
      {:else}{/if}
      <!-- <div class="block" /> -->
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
        width: calc(100% - 40px);
        height: 150px;
        box-shadow: 0 0 5px #555;
        margin: 20px 20px 0 20px;
        border-radius: 10px;
        background-color: white;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        gap: 5px;
      }
    }
  }
</style>
