<script>
  import { onMount } from 'svelte';
  import { resizeObserver } from '#runtime/svelte/action/dom';
  import { Confetti } from '../classes/Confetti';

  let canvasEl;

  onMount(() => {
    Confetti.instance.setCanvasElement(canvasEl);
  });
</script>

<canvas
  id="confetti-canvas"
  bind:this={canvasEl}
  use:resizeObserver={Confetti.instance.onCanvasResize.bind(Confetti.instance)}
/>

<style>
  #confetti-canvas {
    position: absolute;
    left: 0;
    top: 0;

    pointer-events: none;

    width: 100%;
    height: 100%;

    z-index: 2000;
  }
</style>
