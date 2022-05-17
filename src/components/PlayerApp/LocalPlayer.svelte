<script lang="ts">
  import { LOCAL_SONG_PATH } from "../common/stores";
</script>

<div id="local-player-area">
  <audio controls class="player" id="local-player" src={$LOCAL_SONG_PATH} />
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
  }
</style>
