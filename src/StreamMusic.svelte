<script lang="ts">
  import PlayerApp from "./components/PlayerApp/index.svelte";
  import MainLanding from "./components/mainLanding/index.svelte";

  import { FLAG_PAGE_SELECTER } from "./components/common/stores";
</script>

{#if $FLAG_PAGE_SELECTER === 0}
  <MainLanding />
{:else if $FLAG_PAGE_SELECTER === 1}
  <PlayerApp />
{/if}

<style lang="scss">
</style>
