<script lang="ts">
  import EmptyCover from "../common/EmptyCover.svelte";

  import WritableText from "./WritableText.svelte";

  import { PLAYLIST } from "../common/stores";
</script>

{#if $PLAYLIST.currentSong !== null}
  <div class="current-song">
    <span class="line"
      ><span class="subtitle">- TITLE:</span>
      <WritableText
        option={{
          text: $PLAYLIST.currentSong.title,
          key: "title",
          isCurrentSong: true,
        }}
      /></span
    >
    <span class="line">
      <span class="subtitle">- ARTIST:</span>
      <WritableText
        option={{
          text: $PLAYLIST.currentSong.artist,
          key: "artist",
          isCurrentSong: true,
        }}
      />
    </span>
    <span class="line">
      <span class="subtitle">- DURATION:</span>
      <span class="bold">{$PLAYLIST.currentSong.duration}</span>
    </span>
    <span class="line">
      <span class="subtitle">- PLATFORM:</span>
      <span class="bold">{$PLAYLIST.currentSong.type}</span>
    </span>
    {#if $PLAYLIST.currentSong.type === "youtube"}
      <span class="line">
        <a
          target="_blank"
          href="https://youtube.com/watch?v={$PLAYLIST.currentSong.songId}"
          ><svg
            class="icon youtube"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 576 512"
            ><path
              d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
            /></svg
          ><svg
            class="icon common"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 640 512"
            ><path
              d="M172.5 131.1C228.1 75.51 320.5 75.51 376.1 131.1C426.1 181.1 433.5 260.8 392.4 318.3L391.3 319.9C381 334.2 361 337.6 346.7 327.3C332.3 317 328.9 297 339.2 282.7L340.3 281.1C363.2 249 359.6 205.1 331.7 177.2C300.3 145.8 249.2 145.8 217.7 177.2L105.5 289.5C73.99 320.1 73.99 372 105.5 403.5C133.3 431.4 177.3 435 209.3 412.1L210.9 410.1C225.3 400.7 245.3 404 255.5 418.4C265.8 432.8 262.5 452.8 248.1 463.1L246.5 464.2C188.1 505.3 110.2 498.7 60.21 448.8C3.741 392.3 3.741 300.7 60.21 244.3L172.5 131.1zM467.5 380C411 436.5 319.5 436.5 263 380C213 330 206.5 251.2 247.6 193.7L248.7 192.1C258.1 177.8 278.1 174.4 293.3 184.7C307.7 194.1 311.1 214.1 300.8 229.3L299.7 230.9C276.8 262.1 280.4 306.9 308.3 334.8C339.7 366.2 390.8 366.2 422.3 334.8L534.5 222.5C566 191 566 139.1 534.5 108.5C506.7 80.63 462.7 76.99 430.7 99.9L429.1 101C414.7 111.3 394.7 107.1 384.5 93.58C374.2 79.2 377.5 59.21 391.9 48.94L393.5 47.82C451 6.731 529.8 13.25 579.8 63.24C636.3 119.7 636.3 211.3 579.8 267.7L467.5 380z"
            /></svg
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
      display: flex;
      justify-content: flex-start;
      align-items: center;
      gap: 1em;
      font-size: 0.8em;

      .icon {
        position: relative;
        top: 0.15em;
        width: 1em;
        height: 1em;
        margin-right: 0.5em;
      }

      .subtitle {
        white-space: nowrap;
      }
    }
  }
</style>
