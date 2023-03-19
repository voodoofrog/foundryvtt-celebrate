import { MODULE_ABBREV, MODULE_ID, MySettings } from './constants';

/**
 * Registers the module settings
 */
export function registerSettings() {
  // Register any custom module settings here
  // Debug use
  CONFIG[MODULE_ID] = { debug: false };

  // Register any custom module settings here
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
    scope: 'client',
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
  });
}
