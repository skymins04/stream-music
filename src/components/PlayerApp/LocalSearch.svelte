<script lang="ts">
  import { errorToast, successToast } from "../common/toast";
  import {
    FLAG_LOADING_SCREEN_SAVER,
    FLAG_LOCAL_SEARCH_POPUP,
  } from "../common/stores";
  import { savePlayList, getDurationNumToStr } from "../common/functions";
  import Popup from "../common/Popup.svelte";

  /**
   * 재생 대기열에 ytSearchID에 해당하는 YouTube 영상 정보를 추가하는 함수
   */
  const addQueueLocal = () => {};
</script>

<Popup popupFlag={FLAG_LOCAL_SEARCH_POPUP}>
  <div class="viewport-title">로컬 음원파일 선택</div>
  <div class="frm-input">
    <input type="file" />
    <button on:click={addQueueLocal}>추가</button>
  </div>
</Popup>

<style lang="scss">
  .displaynone {
    display: none !important;
  }

  .viewport-title {
    color: var(--color1);
    font-size: 2em;
    font-weight: 100;
    width: max-content;
    margin-right: 20px;
    margin-bottom: 5px;
  }

  .frm-input {
    position: relative;
    width: calc(100% - 18em);
    white-space: nowrap;
    min-width: min-content;

    input,
    button {
      margin: 0;
    }

    input {
      font-size: 0.7em;
      height: 3em;
      width: 100% !important;
      min-width: 13em;
      padding-top: 0.6em;
    }

    button {
      position: relative;
      top: 0.1em;
      font-size: 0.7em;
      height: 3em;
      padding: 0 1.5em;
    }
  }
</style>
