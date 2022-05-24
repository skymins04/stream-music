<script lang="ts">
  import Router from "svelte-spa-router";
  import StreamMusic from "./StreamMusic.svelte";
  import StreamMusicClient from "./StreamMusicClient.svelte";
</script>

<svelte:head
  ><style>
    html,
    body {
      background-color: transparent !important;
    }
  </style></svelte:head
>
<Router
  routes={{ "/": StreamMusic, "/client/:channelId": StreamMusicClient }}
/>

<style lang="scss">
  html,
  body {
    background-color: transparent !important;
  }
</style>
