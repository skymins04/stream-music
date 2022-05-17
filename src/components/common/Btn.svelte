<script lang="ts">
  import MediaQuery from "svelte-media-query";

  export let defaultLabel: string;
  export let minLabel: string = "";
  export let tooltip: string = "";
  export let onClick: () => void;
</script>

<div class="btn" data-tooltip={tooltip} on:click={onClick}>
  <MediaQuery query="(min-width: 800px)" let:matches>
    {#if matches}
      {@html defaultLabel}
    {:else}
      {@html minLabel === "" ? defaultLabel : minLabel}
    {/if}
  </MediaQuery>
</div>

<style lang="scss">
  .btn:not(.btn[data-tooltip=""])::after {
    content: attr(data-tooltip);
    position: absolute;
    bottom: -2em;
    right: -2em;
    display: none;
    max-width: 20em;
    word-break: break-all;
    padding: 0.5em;
    background-color: #00000066;
    border: 1px solid #ccc;
    font-size: 0.5em;
  }
  .btn:not(.btn[data-tooltip=""]):hover::after {
    display: block !important;
  }
  .btn {
    position: relative;
    white-space: nowrap;
    padding: 0.5em 1em;
    border: 1px solid var(--color2);
    border-radius: 8px;
    background-color: var(--color1);
    font-size: 0.8em;
    font-weight: 400;
    color: white;
    transition: 0.1s;
  }
  .btn:hover {
    cursor: pointer;
    background-color: var(--color2);
  }
</style>
