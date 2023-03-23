import { TJSGameSettings } from '@typhonjs-fvtt/svelte-standard/store';
import { MODULE_ABBREV, MODULE_ID, MySettings } from './constants';

const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);

/**
 * Registers the module settings
 */
export const registerSettings = () => {
  // Debug use
  CONFIG[MODULE_ID] = { debug: false };

  const settings = new TJSGameSettings(MODULE_ID);

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.GmOnly,
    folder: 'general',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.GmOnly}.Name`,
      default: false,
      type: Boolean,
      scope: 'world',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.GmOnly}.Hint`,
      onChange: debouncedReload,
    },
  });

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.RapidFireLimit,
    folder: 'general',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.RapidFireLimit}.Name`,
      default: 5,
      range: { min: 0, max: 10, step: 1 },
      type: Number,
      scope: 'world',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.RapidFireLimit}.Hint`,
    },
  });

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.ConfettiMultiplier,
    folder: 'general',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiMultiplier}.Name`,
      default: 1,
      type: Number,
      scope: 'client',
      range: { min: 0.1, max: 3, step: 0.1 },
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiMultiplier}.Hint`,
    },
  });

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.ShowButton,
    folder: 'general',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.ShowButton}.Name`,
      default: true,
      type: Boolean,
      scope: 'client',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.ShowButton}.Hint`,
      onChange: debouncedReload,
    },
  });

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.Mute,
    folder: 'general',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.Mute}.Name`,
      default: false,
      type: Boolean,
      scope: 'client',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.Mute}.Hint`,
    },
  });

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.AllowOtherConfettiScale,
    folder: 'general',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.AllowOtherConfettiScale}.Name`,
      default: true,
      type: Boolean,
      scope: 'client',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.AllowOtherConfettiScale}.Hint`,
    },
  });

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.AllowOtherConfettiDeviation,
    folder: 'general',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.AllowOtherConfettiDeviation}.Name`,
      default: true,
      type: Boolean,
      scope: 'client',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.AllowOtherConfettiDeviation}.Hint`,
    },
  });

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.ConfettiStyleChoice,
    folder: 'appearance',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Name`,
      default: 'default',
      type: String,
      scope: 'client',
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Hint`,
      choices: {
        default: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.Default`,
        base: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.Base`,
        glitter: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.Glitter`,
        baseGlitter: `${MODULE_ABBREV}.settings.${MySettings.ConfettiStyleChoice}.Choices.BaseGlitter`,
      },
    },
  });

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.ConfettiGlitterDeviation,
    folder: 'appearance',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiGlitterDeviation}.Name`,
      default: 50,
      type: Number,
      scope: 'client',
      range: { min: 0, max: 255, step: 1 },
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiGlitterDeviation}.Hint`,
    },
  });

  settings.register({
    namespace: MODULE_ID,
    key: MySettings.ConfettiScale,
    folder: 'appearance',
    options: {
      name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiScale}.Name`,
      default: 1,
      type: Number,
      scope: 'client',
      range: { min: 0.3, max: 2, step: 0.1 },
      config: true,
      hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiScale}.Hint`,
    },
  });
};
