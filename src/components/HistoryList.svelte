<script lang="ts">
  import { fly } from "svelte/transition";
  import { FLAG_HISTORY_LIST } from "../stores";
</script>

{#if $FLAG_HISTORY_LIST}
  <div
    id="history-list-screensaver"
    on:click={() => {
      FLAG_HISTORY_LIST.set(false);
    }}
  />
  <div id="history-list-area" transition:fly={{ x: 300, duration: 500 }}>
    <div class="title-area">
      <div class="title">History</div>
      <div
        class="exit-btn"
        on:click={() => {
          FLAG_HISTORY_LIST.set(false);
        }}
      />
    </div>

    <div class="list">
      <div class="block" />
      <div class="block" />
      <div class="block" />
      <div class="block" />
      <div class="block" />
      <div class="block" />
      <div class="block" />
    </div>
  </div>
{/if}

<style lang="scss">
  @keyframes history-list {
    from {
      right: -300px;
    }
    to {
      right: 0;
    }
  }

  .display-none {
    display: none !important;
  }

  #history-list-screensaver {
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 10;
  }

  #history-list-area {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 300px;
    height: 100%;
    padding-top: 50px;
    padding-bottom: 20px;
    background-color: var(--color3);
    z-index: 10;

    .title-area {
      position: absolute;
      top: 10px;
      left: 0;
      width: 100%;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        color: white;
        font-size: 1.5em;
      }

      .exit-btn {
        position: relative;
        width: 20px;
        height: 20px;
        margin-top: 5px;
      }

      .exit-btn:hover {
        cursor: pointer;
      }
      .exit-btn:hover::before,
      .exit-btn:hover::after {
        background-color: var(--color4) !important;
      }

      .exit-btn::after {
        content: "";
        display: block;
        background-color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 2px;
        transform: translate(-50%, -50%) rotate(45deg);
        transition: 0.1s;
      }

      .exit-btn::before {
        content: "";
        display: block;
        background-color: white;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 2px;
        transform: translate(-50%, -50%) rotate(-45deg);
        transition: 0.1s;
      }
    }

    .list {
      width: 100%;
      height: 100%;
      padding-top: 20px;
      overflow-y: auto;
      -webkit-mask-image: -webkit-gradient(
        linear,
        left bottom,
        left top,
        from(rgba(0, 0, 0, 1)),
        color-stop(0.95, rgba(0, 0, 0, 1)),
        to(rgba(0, 0, 0, 0))
      );

      .block {
        width: calc(100% - 40px);
        height: 150px;
        box-shadow: 0 0 5px #555;
        margin: 20px 20px 0 20px;
        border-radius: 10px;
        background-color: white;
      }
    }
  }
</style>
