<script lang="ts">
  import { LOADING_SCREEN_SAVER_MSG } from "./stores";
</script>

<div id="screen-saver">
  <div class="dialog">
    <span class="msg">{$LOADING_SCREEN_SAVER_MSG}</span>
    <img class="loading-icon" src="img/loading-icon.svg" alt="" />
  </div>
</div>

<style lang="scss">
  #screen-saver {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 10000;
    background-color: #000000aa;
    display: flex;
    justify-content: center;
    align-items: center;

    .dialog {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      width: 200px;
      height: 200px;
      border-radius: 20px;
      box-shadow: 0 0 15px black;
      background-color: white;
      animation: opacityFadeIn 0.2s ease-in;

      .msg {
        color: #666;
        margin-bottom: 15px;
      }

      .loading-icon {
        width: 30px;
        height: 30px;
      }
    }
  }
</style>
