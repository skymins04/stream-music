<script lang="ts">
  import { get } from "svelte/store";
  import { PLAYLIST, savePlayList } from "../stores";

  interface WritableTextOption {
    text: string;
    key: string;
    index?: number;
    isCurrentSong: boolean;
  }

  export let option: WritableTextOption;

  let writeMode: boolean = false;
  let inputTextValue: string = option.text;

  /**
   * PlayList 내 queue의 특정 텍스트를 수정하는 함수
   */
  const saveTextAtQueue = () => {
    (get(PLAYLIST) as any).queue[option.index as number][option.key] =
      inputTextValue;
    savePlayList();
    writeMode = false;
  };

  /**
   * PlayList 내 currentSong의 특정 텍스트를 수정하는 함수
   */
  const saveTextAtCurrentSong = () => {
    (get(PLAYLIST) as any).currentSong[option.key] = inputTextValue;
    savePlayList();
    writeMode = false;
  };

  /**
   * option의 isCurrentSong에 따라 함수를 지정함.
   */
  const saveText = option.isCurrentSong
    ? saveTextAtCurrentSong
    : saveTextAtQueue;
</script>

<div class="writable-text" class:current-song={option.isCurrentSong}>
  <span
    class="text"
    class:current-song={option.isCurrentSong}
    class:display-none={writeMode}
    on:click={() => {
      writeMode = !writeMode;
    }}
    >{option.text}<svg
      class="write-icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      ><path
        d="M421.7 220.3L188.5 453.4L154.6 419.5L158.1 416H112C103.2 416 96 408.8 96 400V353.9L92.51 357.4C87.78 362.2 84.31 368 82.42 374.4L59.44 452.6L137.6 429.6C143.1 427.7 149.8 424.2 154.6 419.5L188.5 453.4C178.1 463.8 165.2 471.5 151.1 475.6L30.77 511C22.35 513.5 13.24 511.2 7.03 504.1C.8198 498.8-1.502 489.7 .976 481.2L36.37 360.9C40.53 346.8 48.16 333.9 58.57 323.5L291.7 90.34L421.7 220.3zM492.7 58.75C517.7 83.74 517.7 124.3 492.7 149.3L444.3 197.7L314.3 67.72L362.7 19.32C387.7-5.678 428.3-5.678 453.3 19.32L492.7 58.75z"
      /></svg
    ></span
  >
  <span class="write-area" class:display-none={!writeMode}>
    <input type="text" bind:value={inputTextValue} />
    <button on:click={saveText}>수정</button>
  </span>
</div>

<style lang="scss">
  .display-none {
    display: none !important;
  }

  .current-song {
    font-size: 1em !important;
    text-align: left !important;
    font-weight: 400 !important;
  }

  .writable-text {
    width: 100%;
    text-align: center;
    .text {
      width: 100%;
      font-size: 0.8em;
      color: #333;
      font-weight: 100;
      text-align: center;

      .write-icon {
        position: relative;
        top: 1px;
        fill: #aaa;
        width: 10px;
        height: 10px;
        margin-left: 0.5em;
      }
    }
    .text:hover {
      cursor: pointer;
      color: black;
      font-weight: 300;

      .write-icon {
        fill: #333;
      }
    }

    .write-area {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      input {
        font-size: 0.8em;
        color: #333;
        width: calc(100% - 3.5em);
        margin: 0 !important;
      }

      button {
        width: 3em;
        height: 100%;
        font-size: 0.8em;
        margin: 0 !important;
      }
    }
  }
</style>
