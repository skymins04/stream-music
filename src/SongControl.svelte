<script lang="ts">
  import { FLAG_PLAYING } from "./stores";

  const clickPlayBtn = () => {
    FLAG_PLAYING.set(!$FLAG_PLAYING);
  };
  const clickForwardBtn = () => {};
</script>

<div id="song-control-interface">
  <div class="song-control-btn" id="play-btn" on:click={clickPlayBtn}>
    {#if !$FLAG_PLAYING}
      <svg
        class="icon play"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        ><path
          d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM176 168V344C176 352.7 180.7 360.7 188.3 364.9C195.8 369.2 205.1 369 212.5 364.5L356.5 276.5C363.6 272.1 368 264.4 368 256C368 247.6 363.6 239.9 356.5 235.5L212.5 147.5C205.1 142.1 195.8 142.8 188.3 147.1C180.7 151.3 176 159.3 176 168V168z"
        /></svg
      >
    {:else}
      <svg
        class="icon pause"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
        ><path
          d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM224 191.1v128C224 337.7 209.7 352 192 352S160 337.7 160 320V191.1C160 174.3 174.3 160 191.1 160S224 174.3 224 191.1zM352 191.1v128C352 337.7 337.7 352 320 352S288 337.7 288 320V191.1C288 174.3 302.3 160 319.1 160S352 174.3 352 191.1z"
        /></svg
      >
    {/if}
  </div>
  <div class="song-control-btn" id="stop-btn">
    <svg
      class="icon stop"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      ><path
        d="M256 0C114.6 0 0 114.6 0 256c0 141.4 114.6 256 256 256s256-114.6 256-256C512 114.6 397.4 0 256 0zM352 328c0 13.2-10.8 24-24 24h-144C170.8 352 160 341.2 160 328v-144C160 170.8 170.8 160 184 160h144C341.2 160 352 170.8 352 184V328z"
      /></svg
    >
  </div>
  <div class="song-control-btn" id="forward-btn" on:click={clickForwardBtn}>
    <svg
      class="icon forward"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 320 512"
      ><path
        d="M287.1 447.1c17.67 0 31.1-14.33 31.1-32V96.03c0-17.67-14.33-32-32-32c-17.67 0-31.1 14.33-31.1 31.1v319.9C255.1 433.6 270.3 447.1 287.1 447.1zM52.51 440.6l192-159.1c7.625-6.436 11.43-15.53 11.43-24.62c0-9.094-3.809-18.18-11.43-24.62l-192-159.1C31.88 54.28 0 68.66 0 96.03v319.9C0 443.3 31.88 457.7 52.51 440.6z"
      /></svg
    >
  </div>
</div>

<style lang="scss">
  #song-control-interface {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 5px;

    .song-control-btn {
      position: relative;
      width: 50px;
      height: 50px;

      .icon {
        position: absolute;
        top: 0;
        left: 0;
        fill: var(--color1);
        transition: 0.2s;
        width: 100%;
        height: 100%;
      }

      .icon:hover {
        cursor: pointer;
        fill: var(--color2);
      }
    }
    #stop-btn,
    #forward-btn {
      width: 35px;
      height: 35px;
    }
  }
</style>
