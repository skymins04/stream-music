<script lang="ts">
  import { PLAYLIST } from "../stores";
  import EmptyCover from "./EmptyCover.svelte";
</script>

{#if $PLAYLIST.currentSong !== null}
  <div class="current-song">
    <span class="line"
      >- TITLE: <span class="bold">{$PLAYLIST.currentSong.title}</span></span
    >
    <span class="line">
      - ARTIST: <span class="bold">{$PLAYLIST.currentSong.artist}</span>
    </span>
    <span class="line">
      - DURATION: <span class="bold">{$PLAYLIST.currentSong.duration}</span>
    </span>
    <span class="line">
      - PLATFORM: <span class="bold">{$PLAYLIST.currentSong.type}</span>
    </span>
    {#if $PLAYLIST.currentSong.type === "youtube"}
      <span class="line">
        <a
          target="_blank"
          href="https://youtube.com/watch?v={$PLAYLIST.currentSong.songId}"
          >https://youtube.com/watch?v={$PLAYLIST.currentSong.songId}</a
        >
      </span>
    {/if}
  </div>
{:else}
  <EmptyCover msg={"현재 재생 중인 곡이 없습니다."} />
{/if}

<style lang="scss">
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
</style>
