<script lang="ts">
  import { fade } from "svelte/transition";

  import {
    FLAG_ALLOW_MOBILE,
    FLAG_PROTECTOR,
    FLAG_PAGE_IS_LOADING,
    PROTECTOR_CONTENT,
  } from "./stores";

  if ($FLAG_PAGE_IS_LOADING) {
    setTimeout(() => {
      FLAG_PAGE_IS_LOADING.set(false);
    }, 2000);
  }
</script>

{#if $FLAG_PROTECTOR && !$FLAG_ALLOW_MOBILE}
  <div class="protector screensaver">
    {@html $PROTECTOR_CONTENT}
    <div class="block">STREAM-MUSIC</div>
  </div>
{:else if $FLAG_PAGE_IS_LOADING}
  <div class="protector loading" transition:fade>
    <img src="/img/loading-icon.svg" alt="" />
  </div>
{:else}
  <slot />
{/if}

<style lang="scss">
  .displaynone {
    display: none !important;
  }
  .protector {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
    color: var(--color1);
    font-size: 1.5em;
    z-index: 100000;

    img {
      width: 120px;
      height: 120px;
    }

    .block {
      margin-top: 3em;
      color: var(--color1);
      font-size: 16px;
    }
  }
</style>
