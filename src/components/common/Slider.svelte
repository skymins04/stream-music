<script lang="ts">
  interface SliderOption {
    thumbColor?: string;
    trackColor?: string;
    progressColor?: string;
    trackWidth?: string;
    step?: number;
    onChange?: () => void;
    onMouseUp?: () => void;
    onMouseDown?: () => void;
  }

  export let min: number = 0;
  export let max: number = 100;
  export let value: number = 0;
  export let option: SliderOption = {
    thumbColor: "#ff3e00",
    trackColor: "#ccc",
    progressColor: "#ff835c",
    trackWidth: "100%",
    step: 0.0000000000000001,
    onChange: () => {},
    onMouseUp: () => {},
    onMouseDown: () => {},
  };
</script>

<input
  style="width: {option.trackWidth};"
  type="range"
  class="slider"
  step={option.step}
  {min}
  {max}
  bind:value
  on:change={option.onChange}
  on:mousedown={option.onMouseDown}
  on:mouseup={option.onMouseUp}
/>

<style lang="scss">
  .slider {
    accent-color: var(--color1);
    margin: 0 !important;
    padding: 0 !important;
  }
</style>
