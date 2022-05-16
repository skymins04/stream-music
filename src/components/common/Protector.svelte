<script lang="ts">
  import {
    FLAG_ALLOW_MOBILE,
    FLAG_PROTECTOR,
    PROTECTOR_CONTENT,
  } from "./stores";
</script>

{#if $FLAG_PROTECTOR && !$FLAG_ALLOW_MOBILE}
  <div class="protector">
    {@html $PROTECTOR_CONTENT}
    <div class="block">STREAM-MUSIC</div>
  </div>
{:else}
  <slot />
{/if}

<style lang="scss">
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

    .block {
      margin-top: 3em;
      color: var(--color1);
      font-size: 16px;
    }
  }
</style>
