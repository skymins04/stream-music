<script lang="ts">
  export let msg: string;
  export let color: string = "#666";
  export let height: string = "calc(100% - 1.5em - 0.8em - 20px)";
</script>

<div class="empty-cover" style="height: {height}; color: {color};">
  {@html msg}
</div>

<style lang="scss">
  .empty-cover {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.8em;
    text-align: center;
  }
</style>
