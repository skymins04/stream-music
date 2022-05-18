<script lang="ts">
  import { fowardSong } from "../common/functions";
  import {
    FLAG_PLAYING,
    FLAG_PLAYER_IS_READY,
    FLAG_PLAYER_IS_BUFFERING,
    PLAYER_DURATION,
    LOCAL_SONG_PATH,
    PLAYER_ELEMENT,
    FLAG_NEXT_SONG_LOADING,
    FLAG_ON_CHANGE_CURRENT_TIME,
    FLAG_ON_CHANGE_VOLUME,
    PLAYER_VOLUME,
    PLAYER_CURRENT_TIME,
    PLAYLIST,
  } from "../common/stores";

  /**
   * 플레이어 정보를 업데이트 하는 서브루틴
   */
  setInterval(() => {
    if ($FLAG_PLAYING && !$FLAG_ON_CHANGE_VOLUME) {
      const volume = Math.floor(
        ($PLAYER_ELEMENT as HTMLMediaElement).volume * 100
      );
      if (typeof volume === "number") PLAYER_VOLUME.set(volume);
    }
    if ($FLAG_PLAYING && !$FLAG_ON_CHANGE_CURRENT_TIME) {
      const currentTime = ($PLAYER_ELEMENT as HTMLMediaElement).currentTime;
      if (typeof currentTime === "number") PLAYER_CURRENT_TIME.set(currentTime);
    }
  }, 1);

  const onCanPlayThroughLocalPlayer = (event: Event) => {
    FLAG_NEXT_SONG_LOADING.set(false);
    FLAG_PLAYER_IS_READY.set(true);
    FLAG_PLAYER_IS_BUFFERING.set(false);
    PLAYER_DURATION.set($PLAYLIST.currentSong?.duration || "00:00");
    ($PLAYER_ELEMENT as HTMLMediaElement).volume = $PLAYER_VOLUME / 100;
  };

  const onPlayLocalPlayer = (event: Event) => {};
  const onEndedLocalPlayer = (event: Event) => {
    fowardSong($FLAG_PLAYING, false);
    PLAYER_DURATION.set("00:00");
  };
</script>

<div id="local-player-area">
  <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"
    ><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path
      d="M224 128L224 0H48C21.49 0 0 21.49 0 48v416C0 490.5 21.49 512 48 512h288c26.51 0 48-21.49 48-48V160h-127.1C238.3 160 224 145.7 224 128zM176 404c0 10.75-12.88 15.98-20.5 8.484L120 376H76C69.38 376 64 370.6 64 364v-56C64 301.4 69.38 296 76 296H120l35.5-36.5C163.1 251.9 176 257.3 176 268V404zM224 387.8c-4.391 0-8.75-1.835-11.91-5.367c-5.906-6.594-5.359-16.69 1.219-22.59C220.2 353.7 224 345.2 224 336s-3.797-17.69-10.69-23.88c-6.578-5.906-7.125-16-1.219-22.59c5.922-6.594 16.05-7.094 22.59-1.219C248.2 300.5 256 317.8 256 336s-7.766 35.53-21.31 47.69C231.6 386.4 227.8 387.8 224 387.8zM320 336c0 41.81-20.5 81.11-54.84 105.1c-2.781 1.938-5.988 2.875-9.145 2.875c-5.047 0-10.03-2.375-13.14-6.844c-5.047-7.25-3.281-17.22 3.969-22.28C272.6 396.9 288 367.4 288 336s-15.38-60.84-41.14-78.8c-7.25-5.062-9.027-15.03-3.98-22.28c5.047-7.281 14.99-9.062 22.27-3.969C299.5 254.9 320 294.2 320 336zM256 0v128h128L256 0z"
    /></svg
  >
  <audio
    controls
    class="player"
    id="local-player"
    src={$LOCAL_SONG_PATH}
    bind:this={$PLAYER_ELEMENT}
    on:ended={onEndedLocalPlayer}
    on:play={onPlayLocalPlayer}
    on:canplaythrough={onCanPlayThroughLocalPlayer}
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
    flex-direction: column;
    gap: 20px;
    background-color: white;
    border: 2px solid var(--color1);

    .icon {
      fill: var(--color1);
      width: 100px;
      height: 100px;
      margin-top: 20px;
    }

    audio::-webkit-media-controls-panel {
      position: relative;
      background-color: white;
    }
    audio::-webkit-media-controls-current-time-display,
    audio::-webkit-media-controls-time-remaining-display,
    audio::-webkit-media-controls-timeline #thumb {
      color: var(--color1);
      text-shadow: none;
      box-shadow: none;
    }
  }
</style>
