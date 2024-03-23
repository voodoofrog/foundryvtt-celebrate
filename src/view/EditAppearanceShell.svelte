<svelte:options accessors={true} />

<script>
  import { getContext } from 'svelte';
  import { ApplicationShell } from '#runtime/svelte/component/core';
  import { localize } from '#runtime/svelte/helper';
  import { colord } from '#runtime/color/colord';
  import { TJSColordPicker } from '#standard/component';
  import { CONFETTI_STYLES, CONFETTI_TEXTURES, MODULE_ID, SETTINGS } from '../constants';
  import { Confetti } from '../classes/Confetti';

  export let elementRoot;
  let textureChoice = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_TEXTURE);
  let confettiStyleChoice = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_STYLE_CHOICE);
  let color = colord(game.settings.get(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_COLOR_BASE)).toHsl();
  let glitterStrength = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_GLITTER_STRENGTH);
  let confettiScale = game.settings.get(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_SCALE);
  const { application } = getContext('#external');
  const { EXTRA_TEXTURES } = SETTINGS;
  const pickerOptions = {
    format: 'hex',
    formatType: 'string',
    hasAlpha: false,
    hasButtonBar: true,
    hasTextInput: false,
    isPopup: true,
    width: 150
  };

  const buildTextureChoiceData = () => {
    const texture_choices = {};
    Object.keys(CONFETTI_TEXTURES).forEach((key) => {
      texture_choices[key] = localize(CONFETTI_TEXTURES[key].translation);
    });

    const registeredTextures = game.settings.get(MODULE_ID, EXTRA_TEXTURES);
    for (const textureDefinition of registeredTextures) {
      texture_choices[textureDefinition.id] = textureDefinition.name;
    }

    return texture_choices;
  };

  const buildStyleChoiceData = () => {
    const style_choices = {};
    Object.keys(CONFETTI_STYLES).forEach((key) => {
      style_choices[key] = localize(CONFETTI_STYLES[key].translation);
    });
    return style_choices;
  };

  const testConfetti = () => {
    const testFireProps = {
      amount: 200,
      velocity: 3000,
      cStyle: confettiStyleChoice,
      cColor: color,
      cScale: confettiScale,
      cgStrength: glitterStrength,
      strength: 2,
      texture: textureChoice
    };
    Confetti.instance.handleShootConfetti(testFireProps);
  };

  const saveSettings = async () => {
    await game.settings.set(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_TEXTURE, textureChoice);
    await game.settings.set(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_STYLE_CHOICE, confettiStyleChoice);
    await game.settings.set(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_COLOR_BASE, colord(color).toHex());
    await game.settings.set(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_GLITTER_STRENGTH, glitterStrength);
    await game.settings.set(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_SCALE, confettiScale);
    application.close();
  };
</script>

<ApplicationShell bind:elementRoot>
  <div>
    <section class="content">
      <div class="form-group">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>{localize('celebrate.settings.appearance.confettiTexture.name')}</label>
        <div class="form-fields">
          <select name="confettiTexture" on:change={(e) => (textureChoice = e.currentTarget.value)}>
            {#each Object.entries(buildTextureChoiceData()) as [key, value]}
              <option value={key} selected={key === textureChoice}>{value}</option>
            {/each}
          </select>
        </div>
        <p class="notes">{localize('celebrate.settings.appearance.confettiTexture.hint')}</p>
      </div>
      <div class="form-group">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>{localize('celebrate.settings.appearance.confettiStyleChoice.name')}</label>
        <div class="form-fields">
          <select name="confettiStyleChoice" on:change={(e) => (confettiStyleChoice = e.currentTarget.value)}>
            {#each Object.entries(buildStyleChoiceData()) as [key, value]}
              <option value={key} selected={key === confettiStyleChoice}>{value}</option>
            {/each}
          </select>
        </div>
        <p class="notes">{localize('celebrate.settings.appearance.confettiStyleChoice.hint')}</p>
      </div>
      {#if confettiStyleChoice !== 'default'}
        {#if confettiStyleChoice !== 'glitter'}
          <div class="form-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>{localize('celebrate.settings.appearance.confettiColorBase.name')}</label>
            <div class="form-fields">
              <input
                type="text"
                class="color-hex"
                on:blur={(e) => (color = colord(e.currentTarget.value).toHsl())}
                value={colord(color).toHex()}
              />
              <TJSColordPicker bind:color options={pickerOptions} />
            </div>
            <p class="notes">{localize('celebrate.settings.appearance.confettiColorBase.hint')}</p>
          </div>
        {/if}

        {#if confettiStyleChoice !== 'base'}
          <div class="form-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>{localize('celebrate.settings.appearance.confettiGlitterStrength.name')}</label>
            <div class="form-fields">
              <input type="range" min="0" max="255" bind:value={glitterStrength} />
              <span class="range-value">{glitterStrength}</span>
            </div>
            <p class="notes">{localize('celebrate.settings.appearance.confettiGlitterStrength.hint')}</p>
          </div>
        {/if}
      {/if}
      <div class="form-group">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>{localize('celebrate.settings.appearance.confettiScale.name')}</label>
        <div class="form-fields">
          <input type="range" min="0.3" max="2" step="0.1" bind:value={confettiScale} />
          <span class="range-value">{confettiScale}</span>
        </div>
        <p class="notes">{localize('celebrate.settings.appearance.confettiScale.hint')}</p>
      </div>
    </section>

    <footer class="sheet-footer flexrow">
      <button on:click={testConfetti}>
        <i class="far fa-party-horn"></i>{localize('celebrate.settings.appearance.buttons.test')}
      </button>
      <button on:click={() => application.close()}>
        <i class="far fa-cancel"></i>{localize('celebrate.settings.appearance.buttons.cancel')}
      </button>
      <button on:click={saveSettings}>
        <i class="far fa-save"></i>{localize('celebrate.settings.appearance.buttons.submit')}
      </button>
    </footer>
  </div>
</ApplicationShell>

<style lang="scss">
  .form-group {
    clear: both;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: 3px 0;
    align-items: center;
    margin-bottom: 1rem;

    > label {
      line-height: 1.25;
      flex: 2;
    }

    > * {
      flex: 3;
    }

    .form-fields {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;

      > * {
        flex: 1;
      }

      input[type='range'] + .range-value {
        display: block;
        flex: 0 1 48px;
        text-align: center;
        border: 1px solid var(--color-border-light-primary);
        padding: 2px;
        margin-left: 10px;
      }
    }

    .notes {
      flex: 0 0 100%;
      font-size: var(--font-size-12);
      line-height: var(--line-height-16);
      color: var(--color-text-dark-secondary);
      margin: 3px 0;
    }
  }

  footer {
    button {
      background: rgba(0, 0, 0, 0.1);
      border: 2px groove var(--color-border-light-highlight);
    }
  }
</style>
