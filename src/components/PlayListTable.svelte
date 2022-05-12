<script lang="ts">
  import { PLAYLIST, Song, savePlayList } from "../stores";
  import { successToast } from "../toast";
  import WritableText from "./WritableText.svelte";
  import EmptyCover from "./EmptyCover.svelte";

  /**
   * 재생 대기열 내 노래의 순번을 변경하는 함수
   * @param n 변경할 노래의 인덱스 번호
   * @param offset 순번 변경 오프셋, 1: UP, -1: DOWN
   */
  const songUpDown = (n: number, offset: number = 1) => {
    if (
      (n > 0 && offset === 1) ||
      ($PLAYLIST.queue.length - 1 !== n && offset === -1)
    ) {
      const songA: Song = $PLAYLIST.queue[n];
      const songB: Song = $PLAYLIST.queue[n - 1 * offset];
      $PLAYLIST.queue[n] = songB;
      $PLAYLIST.queue[n - 1 * offset] = songA;
      savePlayList();
    }
  };

  /**
   * 재생 대기열 내 노래를 제거하는 함수
   * @param n 제거할 노래의 인덱스 번호
   */
  const songDel = (n: number) => {
    if (n >= 0 && n <= $PLAYLIST.queue.length - 1) {
      if (confirm("정말 재생대기열에서 삭제하시겠습니까?")) {
        $PLAYLIST.queue.splice(n, 1);
        savePlayList();
        successToast("노래를 재생대기열에서 삭제했습니다.");
      }
    }
  };
</script>

{#if $PLAYLIST.queue.length != 0}
  <table class="playlist-table">
    <colgroup>
      <col width="40px" />
      <col width="300px" />
      <col width="150px" />
      <col width="70px" />
      <col width="70px" />
      <col width="100px" />
    </colgroup>
    <tbody>
      {#each $PLAYLIST.queue as song, i}
        <tr>
          <td>{i + 1}</td>
          <td>
            <WritableText
              option={{ text: song.title, key: "title", index: i }}
            />
          </td>
          <td>
            <WritableText
              option={{ text: song.artist, key: "artist", index: i }}
            />
          </td>
          <td>{song.type}</td>
          <td>{song.duration}</td>
          <td>
            <div
              class="song-setting-btn song-up"
              on:click={() => {
                songUpDown(i);
              }}
            >
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                ><path
                  d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156 9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333 274.5 9.39 265.4z"
                /></svg
              >
            </div>
            <div
              class="song-setting-btn song-down"
              on:click={() => {
                songUpDown(i, -1);
              }}
            >
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                ><path
                  d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244 237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"
                /></svg
              >
            </div>
            <div
              class="song-setting-btn song-del"
              on:click={() => {
                songDel(i);
              }}
            >
              <svg
                class="icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                ><path
                  d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"
                /></svg
              >
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
{:else}
  <EmptyCover
    msg={"플레이리스트에 대기 중인 곡이 없습니다.<br>YouTube 또는 로컬 음원파일(mp3, wav)을 추가해보세요!"}
    height={"100%"}
  />
{/if}

<style lang="scss">
  .playlist-table {
    position: relative;
    width: 100%;
    border-collapse: collapse;

    thead tr {
      border-bottom: 1px solid #ccc;
    }
    tbody tr {
      border-bottom: 1px solid #ebebeb;
    }

    th {
      color: #666;
      padding-bottom: 10px;
      margin-bottom: 20px;
      font-size: 0.6em;
    }

    td {
      font-size: 0.8em;
      padding: 5px 0;
    }

    th,
    td {
      text-align: center;
    }

    .playlist-thumbnail {
      height: 50px;
    }

    .song-setting-btn {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 18px;
      height: 18px;
      border: 1px solid #ccc;
      border-radius: 2px;
      vertical-align: middle;

      .icon {
        width: 14px;
        height: 14px;
        fill: #aaa;
        transition: 0.1s;
      }
    }
    .song-setting-btn:hover {
      cursor: pointer;
      box-shadow: 0 0 3px #ccc;

      .icon {
        fill: var(--color1);
      }
    }
  }
</style>
