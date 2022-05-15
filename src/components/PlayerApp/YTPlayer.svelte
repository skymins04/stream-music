<script lang="ts">
  import YouTube from "svelte-youtube";

  import {
    FLAG_PLAYER_IS_READY,
    FLAG_PLAYING,
    FLAG_NEXT_SONG_LOADING,
    FLAG_ON_CHANGE_CURRENT_TIME,
    FLAG_ON_CHANGE_VOLUME,
    YT_VIDEO_ID,
    PLAYER_ELEMENT,
    PLAYER_VOLUME,
    PLAYER_DURATION,
    PLAYER_CURRENT_TIME,
    PLAYLIST,
    FLAG_PLAYER_IS_BUFFERING,
    FLAG_PLAYER_IS_RUNNING,
  } from "../common/stores";
  import { fowardSong } from "../common/functions";

  /**
   * 플레이어 정보를 업데이트 하는 서브루틴
   */
  setInterval(() => {
    if (
      $FLAG_PLAYING &&
      !$FLAG_ON_CHANGE_VOLUME &&
      !$FLAG_PLAYER_IS_BUFFERING &&
      $FLAG_PLAYER_IS_RUNNING &&
      ($PLAYER_ELEMENT as any).getVolume
    ) {
      const volume = ($PLAYER_ELEMENT as any).getVolume();
      if (typeof volume === "number") {
        PLAYER_VOLUME.set(volume);
      }
    }
    if (
      $FLAG_PLAYING &&
      !$FLAG_ON_CHANGE_CURRENT_TIME &&
      !$FLAG_PLAYER_IS_BUFFERING &&
      $FLAG_PLAYER_IS_RUNNING &&
      ($PLAYER_ELEMENT as any).getCurrentTime
    ) {
      PLAYER_CURRENT_TIME.set(($PLAYER_ELEMENT as any).getCurrentTime());
    }
  }, 1);

  /**
   * YouTube iframe의 Event handler를 얻는 함수
   * @param event
   */
  const onReadyYoutubePlayer = (event) => {
    PLAYER_ELEMENT.set(event.detail.target);
  };

  /**
   * YouTube iframe의 상태변화 Event handler
   * @param event
   */
  const onStateChangeYoutubePlayer = (event) => {
    if (event.detail.data === -1) {
      // not started
      PLAYER_DURATION.set("00:00");
      FLAG_PLAYER_IS_BUFFERING.set(false);
    } else if (event.detail.data === 0) {
      // end video
      fowardSong($FLAG_PLAYING);
      FLAG_PLAYER_IS_READY.set(false);
      PLAYER_DURATION.set("00:00");
      FLAG_PLAYER_IS_BUFFERING.set(false);
      FLAG_PLAYER_IS_RUNNING.set(false);
    } else if (event.detail.data === 1) {
      // is playing
      ($PLAYER_ELEMENT as any).setVolume($PLAYER_VOLUME);
      FLAG_PLAYING.set(true);
      FLAG_PLAYER_IS_READY.set(true);
      FLAG_PLAYER_IS_BUFFERING.set(false);
      const duration = $PLAYLIST.currentSong?.duration;
      if (duration) PLAYER_DURATION.set(duration);
      setTimeout(() => {
        FLAG_PLAYER_IS_RUNNING.set(true);
      }, 2000);
    } else if (event.detail.data === 2) {
      // paused
      FLAG_PLAYING.set(false);
    } else if (event.detail.data === 3) {
      // buffering
      FLAG_PLAYER_IS_BUFFERING.set(true);
    } else if (event.detail.data === 5) {
      // video on ready
      if ($FLAG_PLAYING) {
        ($PLAYER_ELEMENT as any).playVideo();
      }
      const duration = $PLAYLIST.currentSong?.duration;
      if (duration) PLAYER_DURATION.set(duration);
      FLAG_PLAYER_IS_READY.set(true);
      FLAG_NEXT_SONG_LOADING.set(false);
      FLAG_PLAYER_IS_BUFFERING.set(false);
      FLAG_PLAYER_IS_RUNNING.set(false);
    }
  };
</script>

<YouTube
  videoId={$YT_VIDEO_ID}
  on:ready={onReadyYoutubePlayer}
  on:stateChange={onStateChangeYoutubePlayer}
/>

<style lang="scss">
</style>
