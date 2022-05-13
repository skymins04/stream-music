<script lang="ts">
  export let label: string;
  export let onClick: () => void;
</script>

<div class="btn" on:click={onClick}>
  {@html label}
</div>

<style lang="scss">
  .btn {
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
