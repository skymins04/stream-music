<script lang="ts">
  import { LOCAL_SONG_PATH } from "../common/stores";
</script>

<div id="local-player-area">
  <audio
    class="player"
    id="local-player"
    src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  />
</div>

<style lang="scss">
  #local-player-area {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: aqua;

    audio {
      border: 1px solid red;
      z-index: 1000;
    }
  }
</style>
