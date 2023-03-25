<svelte:options accessors={true} />

<script>
  import { ApplicationShell } from '@typhonjs-fvtt/runtime/svelte/component/core';
  import { TJSSettingsEdit } from '@typhonjs-fvtt/svelte-standard/component';
  export let elementRoot;
  export let settings = void 0;
</script>

<ApplicationShell bind:elementRoot>
  <TJSSettingsEdit {settings} />
</ApplicationShell>
