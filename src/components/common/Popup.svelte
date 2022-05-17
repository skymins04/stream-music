<script lang="ts">
  import { Writable } from "svelte/store";

  export let popupFlag: Writable<boolean>;
</script>

<div
  class="popup"
  on:click={() => {
    popupFlag.set(false);
  }}
>
  <div
    class="viewport"
    on:click={(event) => {
      event.stopPropagation();
    }}
  >
    <div
      class="exit-btn"
      on:click={() => {
        popupFlag.set(false);
      }}
    />
    <div class="interface link">
      <slot />
    </div>
  </div>
</div>

<style lang="scss">
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000000aa;
    z-index: 1000;

    .viewport {
      position: relative;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 90%;
      max-width: 900px;
      height: 150px;
      background-color: white;
      border-radius: 20px;
      box-shadow: 0 0 15px black;
      padding: 50px;
      animation: opacityFadeIn 0.2s ease-in;

      .exit-btn {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 20px;
        height: 20px;
      }
      .exit-btn:hover {
        cursor: pointer;
      }
      .exit-btn:hover::before,
      .exit-btn:hover::after {
        background-color: #555;
      }
      .exit-btn::before,
      .exit-btn::after {
        content: "";
        display: block;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 3px;
        background-color: #ccc;
        transition: 0.2s;
      }
      .exit-btn::before {
        transform: translate(-50%, -50%) rotate(45deg);
      }
      .exit-btn::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      .interface {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
      }
      .interface.link {
        width: calc(100% - 4em);
        margin-bottom: 5px;
      }
    }
  }
</style>
