import { AppearanceSettings } from './classes/AppearanceSettings';
import { MODULE_ABBREV, MODULE_ID, MySettings } from './constants';

const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);

/**
 * Registers the module settings
 */
export const registerSettings = () => {
  // Debug use
  CONFIG[MODULE_ID] = { debug: false };

  game.settings.register(MODULE_ID, MySettings.GmOnly, {
    name: `${MODULE_ABBREV}.settings.${MySettings.GmOnly}.Name`,
    default: false,
    type: Boolean,
    scope: 'world',
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.GmOnly}.Hint`,
    onChange: debouncedReload,
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

  game.settings.register(MODULE_ID, MySettings.ConfettiMultiplier, {
    name: `${MODULE_ABBREV}.settings.${MySettings.ConfettiMultiplier}.Name`,
    default: 1,
    type: Number,
    scope: 'client',
    range: { min: 0.1, max: 3, step: 0.1 },
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.ConfettiMultiplier}.Hint`,
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

  game.settings.register(MODULE_ID, MySettings.Mute, {
    name: `${MODULE_ABBREV}.settings.${MySettings.Mute}.Name`,
    default: false,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.Mute}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.AllowOtherConfettiScale, {
    name: `${MODULE_ABBREV}.settings.${MySettings.AllowOtherConfettiScale}.Name`,
    default: true,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.AllowOtherConfettiScale}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.AllowOtherConfettiDeviation, {
    name: `${MODULE_ABBREV}.settings.${MySettings.AllowOtherConfettiDeviation}.Name`,
    default: true,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ABBREV}.settings.${MySettings.AllowOtherConfettiDeviation}.Hint`,
  });

  game.settings.register(MODULE_ID, MySettings.ConfettiColorBase, {
    default: true,
    type: String,
    scope: 'client',
    config: false,
  });

  game.settings.register(MODULE_ID, MySettings.ConfettiStyleChoice, {
    default: 'default',
    type: String,
    scope: 'client',
    config: false,
  });

  game.settings.register(MODULE_ID, MySettings.ConfettiGlitterDeviation, {
    default: 50,
    type: Number,
    scope: 'client',
    config: false,
  });

  game.settings.register(MODULE_ID, MySettings.ConfettiScale, {
    default: 1,
    type: Number,
    scope: 'client',
    config: false,
  });

  game.settings.registerMenu(MODULE_ID, MySettings.AppearanceMenu, {
    name: 'Confetti Appearance',
    label: 'Configure Confetti',
    hint: 'Change your confetti appearance.',
    icon: 'fas fa-bars',
    type: AppearanceSettings,
    restricted: false,
  });
};
