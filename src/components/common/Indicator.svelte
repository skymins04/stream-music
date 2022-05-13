<script lang="ts">
  export let state: boolean;
</script>

<div class="indicator" class:green={state} class:red={!state} />

<style lang="scss">
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    margin-top: 1px;
  }
  .red {
    background-color: #d63c33;
  }
  .green {
    background-color: #58b84d;
  }
</style>
