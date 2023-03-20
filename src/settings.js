import { MODULE_ABBREV, MODULE_ID, MySettings } from './constants';

/**
 * Registers the module settings
 */
export function registerSettings() {
  // Debug use
  CONFIG[MODULE_ID] = { debug: false };

  const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);

  game.settings.register(MODULE_ID, MySettings.GmOnly, {
    name: `${MODULE_ABBREV}.settings.${MySettings.GmOnly}.Name`,
    default: false,
    type: Boolean,
    scope: 'world',
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.GmOnly}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.ConfettiMultiplier, {
    name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiMultiplier}.Name`,
    default: 1,
    type: Number,
    scope: 'client',
    range: { min: 0.1, max: 10, step: 0.1 },
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiMultiplier}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.ConfettiScale, {
    name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiScale}.Name`,
    default: 1,
    type: Number,
    scope: 'client',
    range: { min: 0.3, max: 2, step: 0.1 },
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiScale}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.ConfettiColorChoice, {
    name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiColorChoice}.Name`,
    default: 'default',
    type: String,
    choices: {
      default: 'Default',
      base: 'Base Colour',
      glitter: 'Glitter',
      baseGlitter: 'Base Glitter',
    },
    scope: 'client',
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiColorChoice}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.ConfettiGlitterDeviation, {
    name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiGlitterDeviation}.Name`,
    default: 50,
    type: Number,
    scope: 'client',
    range: { min: 0, max: 255, step: 1 },
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiGlitterDeviation}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.Mute, {
    name: `${MODULE_ABBREV}.settings.${MySettings.Mute}.Name`,
    default: false,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.Mute}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.RapidFireLimit, {
    name: `${MODULE_ABBREV}.settings.${MySettings.RapidFireLimit}.Name`,
    default: 5,
    range: { min: 0, max: 10, step: 1 },
    type: Number,
    scope: 'world',
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.RapidFireLimit}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.ShowButton, {
    name: `${MODULE_ABBREV}.settings.${MySettings.ShowButton}.Name`,
    default: true,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.ShowButton}.Hint`,
    onChange: debouncedReload,
  });
}
