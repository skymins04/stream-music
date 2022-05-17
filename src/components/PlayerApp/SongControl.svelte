<script lang="ts">
  import {
    FLAG_PLAYING,
    PLAYLIST,
    PLAYER_ELEMENT,
    PLAYER_VOLUME,
    FLAG_ON_CHANGE_VOLUME,
    FLAG_ON_CHANGE_CURRENT_TIME,
    PLAYER_DURATION,
    PLAYER_CURRENT_TIME,
    FLAG_PLAYER_IS_READY,
    FLAG_PLAYER_IS_BUFFERING,
  } from "../common/stores";
  import {
    playSong,
    stopSong,
    fowardSong,
    getDurationNumToStr,
    getDurationStrToNum,
  } from "../common/functions";

  import Slider from "../common/Slider.svelte";
  import App from "../../App.svelte";

  let playerDurationNum = 0;
  let playerCurrentTimeStr = "00:00";

  /**
   * 재생/일시정지 버튼 클릭 이벤트 핸들러
   */
  const clickPlayBtn = () => {
    const currentSong = $PLAYLIST.currentSong;

    // 재생 상태 토글
    FLAG_PLAYING.set(!$FLAG_PLAYING);

    // 재생상태가 재생시작인 경우이고 현재 재생중인 곡이 없는 경우
    if ($FLAG_PLAYING && currentSong === null) {
      playSong($FLAG_PLAYING);
    }
    // 현재 재생중인 곡이 있는 경우에서 재생 토글
    else {
      if (currentSong?.type === "youtube") {
        if ($FLAG_PLAYING) ($PLAYER_ELEMENT as any).playVideo();
        else ($PLAYER_ELEMENT as any).pauseVideo();
      } else if (currentSong?.type === "local") {
        if ($FLAG_PLAYING) ($PLAYER_ELEMENT as HTMLMediaElement).play();
        else ($PLAYER_ELEMENT as HTMLMediaElement).pause();
      }
    }
  };

  /**
   * 재생 중지 버튼 클릭 이벤트 핸들러
   */
  const clickStopBtn = () => {
    stopSong();
  };

  /**
   * 다음곡 버튼 클릭 이벤트 핸들러
   */
  const clickForwardBtn = () => {
    fowardSong($FLAG_PLAYING);
  };

  /**
   * 볼륨 값 변경 시 이벤트 핸들러
   */
  PLAYER_VOLUME.subscribe((value) => {
    localStorage.setItem("playerVolume", String(value));
    if ($FLAG_PLAYING && value !== undefined) {
      if ($PLAYLIST.currentSong?.type === "youtube")
        ($PLAYER_ELEMENT as any).setVolume(value);
      else if ($PLAYLIST.currentSong?.type === "local")
        ($PLAYER_ELEMENT as HTMLAudioElement).volume = value / 100;
    }
  });

  /**
   * 현재 재생시간 변경 시 이벤트 핸들러
   */
  PLAYER_CURRENT_TIME.subscribe((value) => {
    playerCurrentTimeStr = getDurationNumToStr(value);
    if ($FLAG_ON_CHANGE_CURRENT_TIME) {
      if ($PLAYLIST.currentSong?.type === "youtube")
        ($PLAYER_ELEMENT as any).seekTo(value, false);
      else if ($PLAYLIST.currentSong?.type === "local")
        ($PLAYER_ELEMENT as HTMLAudioElement).currentTime = value / 100;
    }
  });

  /**
   * Duration 변경 시 이벤트 핸들러
   */
  PLAYER_DURATION.subscribe((value) => {
    playerDurationNum = getDurationStrToNum(value);
  });
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
  <div class="song-control-btn" id="stop-btn" on:click={clickStopBtn}>
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
  <div class="song-control-slider">
    <div class="line">
      <span class="text current-time">{playerCurrentTimeStr}</span>
      <Slider
        bind:value={$PLAYER_CURRENT_TIME}
        bind:max={playerDurationNum}
        option={{
          trackWidth: "100%",
          onMouseDown: () => {
            if (
              $FLAG_PLAYING &&
              $FLAG_PLAYER_IS_READY &&
              !$FLAG_PLAYER_IS_BUFFERING
            ) {
              FLAG_ON_CHANGE_CURRENT_TIME.set(true);
              if ($PLAYLIST.currentSong?.type === "youtube")
                $PLAYER_ELEMENT.seekTo($PLAYER_CURRENT_TIME, false);
              else if ($PLAYLIST.currentSong?.type === "local")
                $PLAYER_ELEMENT.currentTime = $PLAYER_CURRENT_TIME;
            } else if (!$FLAG_PLAYING && $FLAG_PLAYER_IS_READY) {
              if ($PLAYLIST.currentSong?.type === "youtube")
                $PLAYER_ELEMENT.playVideo();
              else if ($PLAYLIST.currentSong?.type === "local") {
                FLAG_PLAYING.set(true);
                $PLAYER_ELEMENT.volume = $PLAYER_VOLUME / 100;
                $PLAYER_ELEMENT.currentTime = $PLAYER_CURRENT_TIME;
                $PLAYER_ELEMENT.play();
              }
            }
          },
          onMouseUp: () => {
            FLAG_ON_CHANGE_CURRENT_TIME.set(false);
            if (
              $FLAG_PLAYING &&
              $FLAG_PLAYER_IS_READY &&
              !$FLAG_PLAYER_IS_BUFFERING
            )
              if ($PLAYLIST.currentSong?.type === "youtube")
                $PLAYER_ELEMENT.seekTo($PLAYER_CURRENT_TIME);
              else if ($PLAYLIST.currentSong?.type === "local")
                $PLAYER_ELEMENT.currentTime = $PLAYER_CURRENT_TIME;
              else if (!$FLAG_PLAYING && $FLAG_PLAYER_IS_READY) {
                if ($PLAYLIST.currentSong?.type === "youtube")
                  $PLAYER_ELEMENT.playVideo();
                else if ($PLAYLIST.currentSong?.type === "local") {
                  FLAG_PLAYING.set(true);
                  $PLAYER_ELEMENT.volume = $PLAYER_VOLUME / 100;
                  $PLAYER_ELEMENT.currentTime = $PLAYER_CURRENT_TIME;
                  $PLAYER_ELEMENT.play();
                }
              }
          },
        }}
      />
      <span class="text duration">{$PLAYER_DURATION}</span>
    </div>

    <div class="line">
      <svg
        class:display-block={$PLAYER_VOLUME >= 65}
        class="icon common volume-icon volume-high"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 512"
        ><path
          d="M412.6 182c-10.28-8.334-25.41-6.867-33.75 3.402c-8.406 10.24-6.906 25.35 3.375 33.74C393.5 228.4 400 241.8 400 255.1c0 14.17-6.5 27.59-17.81 36.83c-10.28 8.396-11.78 23.5-3.375 33.74c4.719 5.806 11.62 8.802 18.56 8.802c5.344 0 10.75-1.779 15.19-5.399C435.1 311.5 448 284.6 448 255.1S435.1 200.4 412.6 182zM473.1 108.2c-10.22-8.334-25.34-6.898-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C476.6 172.1 496 213.3 496 255.1s-19.44 82.1-53.31 110.7c-10.25 8.396-11.75 23.5-3.344 33.74c4.75 5.775 11.62 8.771 18.56 8.771c5.375 0 10.75-1.779 15.22-5.431C518.2 366.9 544 313 544 255.1S518.2 145 473.1 108.2zM534.4 33.4c-10.22-8.334-25.34-6.867-33.78 3.34c-8.406 10.24-6.906 25.35 3.344 33.74C559.9 116.3 592 183.9 592 255.1s-32.09 139.7-88.06 185.5c-10.25 8.396-11.75 23.5-3.344 33.74C505.3 481 512.2 484 519.2 484c5.375 0 10.75-1.779 15.22-5.431C601.5 423.6 640 342.5 640 255.1S601.5 88.34 534.4 33.4zM301.2 34.98c-11.5-5.181-25.01-3.076-34.43 5.29L131.8 160.1H48c-26.51 0-48 21.48-48 47.96v95.92c0 26.48 21.49 47.96 48 47.96h83.84l134.9 119.8C272.7 477 280.3 479.8 288 479.8c4.438 0 8.959-.9314 13.16-2.835C312.7 471.8 320 460.4 320 447.9V64.12C320 51.55 312.7 40.13 301.2 34.98z"
        /></svg
      >
      <svg
        class:display-block={$PLAYER_VOLUME > 0 && $PLAYER_VOLUME < 65}
        class="icon common volume-icon volume-low"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 448 512"
        ><path
          d="M412.6 181.9c-10.28-8.344-25.41-6.875-33.75 3.406c-8.406 10.25-6.906 25.37 3.375 33.78C393.5 228.4 400 241.8 400 256c0 14.19-6.5 27.62-17.81 36.87c-10.28 8.406-11.78 23.53-3.375 33.78c4.719 5.812 11.62 8.812 18.56 8.812c5.344 0 10.75-1.781 15.19-5.406C435.1 311.6 448 284.7 448 256S435.1 200.4 412.6 181.9zM301.2 34.84c-11.5-5.187-25.01-3.116-34.43 5.259L131.8 160H48c-26.51 0-48 21.49-48 47.1v95.1c0 26.51 21.49 47.1 48 47.1h83.84l134.9 119.9C272.7 477.2 280.3 480 288 480c4.438 0 8.959-.9313 13.16-2.837C312.7 472 320 460.6 320 448V64C320 51.41 312.7 39.1 301.2 34.84z"
        /></svg
      >
      <svg
        class:display-block={$PLAYER_VOLUME === 0}
        class="icon common volume-icon volume-off"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
        ><path
          d="M320 64v383.1c0 12.59-7.337 24.01-18.84 29.16C296.1 479.1 292.4 480 288 480c-7.688 0-15.28-2.781-21.27-8.094l-134.9-119.9H48c-26.51 0-48-21.49-48-47.1V208c0-26.51 21.49-47.1 48-47.1h83.84l134.9-119.9c9.422-8.375 22.93-10.45 34.43-5.259C312.7 39.1 320 51.41 320 64z"
        /></svg
      >
      <Slider
        bind:value={$PLAYER_VOLUME}
        option={{
          step: 1,
          onMouseDown: () => {
            FLAG_ON_CHANGE_VOLUME.set(true);
          },
          onMouseUp: () => {
            FLAG_ON_CHANGE_VOLUME.set(false);
          },
        }}
      />
      <span class="text">{$PLAYER_VOLUME}</span>
    </div>
  </div>
</div>

<style lang="scss">
  .display-block {
    display: block !important;
  }

  #song-control-interface {
    position: relative;
    width: 100%;
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

    .song-control-slider {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-direction: column;
      gap: 5px;
      position: relative;
      width: 100%;
      padding-left: 20px;
      padding-right: 20px;

      .line {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;

        .text {
          position: relative;
          top: -0.1em;
          font-size: 0.8em;
        }

        .icon {
          position: relative;
          display: none;
          min-width: 30px;
          padding-right: auto;
        }

        .volume-high {
          left: 4px;
          width: 20px;
          height: 15px;
        }
        .volume-low {
          left: 2px;
          width: 15px;
          height: 15px;
        }
        .volume-off {
          width: 15px;
          height: 15px;
        }
      }
      .line:last-child {
        width: 100%;
        max-width: 10em;
      }
    }
  }
</style>
