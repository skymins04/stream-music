<script lang="ts">
  import YouTube from "svelte-youtube";
  import { get } from "svelte/store";

  import {
    FLAG_PLAYER_IS_READY,
    FLAG_PLAYING,
    FLAG_NEXT_SONG_LOADING,
    YT_VIDEO_ID,
    PLAYER_ELEMENT,
    PLAYER_VOLUME,
    FLAG_ON_CHANGE_VOLUME,
  } from "../common/stores";
  import { fowardSong } from "../common/functions";

  setInterval(() => {
    if ($FLAG_PLAYING && !$FLAG_ON_CHANGE_VOLUME) {
      PLAYER_VOLUME.set(($PLAYER_ELEMENT as any).getVolume());
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
      FLAG_PLAYER_IS_READY.set(false);
    } else if (event.detail.data === 0) {
      // end video
      fowardSong($FLAG_PLAYING);
    } else if (event.detail.data === 1) {
      // is playing
      FLAG_PLAYING.set(true);
    } else if (event.detail.data === 2) {
      // paused
      FLAG_PLAYING.set(false);
    } else if (event.detail.data === 5) {
      // video on ready
      if ($FLAG_PLAYING) {
        ($PLAYER_ELEMENT as any).playVideo();
      }
      ($PLAYER_ELEMENT as any).setVolume($PLAYER_VOLUME);
      FLAG_PLAYER_IS_READY.set(true);
      FLAG_NEXT_SONG_LOADING.set(false);
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
