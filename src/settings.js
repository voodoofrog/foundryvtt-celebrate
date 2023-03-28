import { AppearanceSettings } from './classes/AppearanceSettings';
import { CONFETTI_STYLES, MODULE_ID, SETTINGS } from './constants';

const debouncedReload = foundry.utils.debounce(() => window.location.reload(), 100);

/**
 * Registers the module settings
 */
export const registerSettings = () => {
  // Debug use
  CONFIG[MODULE_ID] = { debug: false };

  game.settings.register(MODULE_ID, SETTINGS.GM_ONLY, {
    name: `${MODULE_ID}.settings.${SETTINGS.GM_ONLY}.name`,
    default: false,
    type: Boolean,
    scope: 'world',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.GM_ONLY}.hint`,
    onChange: debouncedReload,
  });

  game.settings.register(MODULE_ID, SETTINGS.FIRE_RATE_LIMIT, {
    name: `${MODULE_ID}.settings.${SETTINGS.FIRE_RATE_LIMIT}.name`,
    default: 5,
    range: { min: 0, max: 10, step: 1 },
    type: Number,
    scope: 'world',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.FIRE_RATE_LIMIT}.hint`,
  });

  game.settings.register(MODULE_ID, SETTINGS.CONFETTI_MULTIPLIER, {
    name: `${MODULE_ID}.settings.${SETTINGS.CONFETTI_MULTIPLIER}.name`,
    default: 1,
    type: Number,
    scope: 'client',
    range: { min: 0.1, max: 3, step: 0.1 },
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.CONFETTI_MULTIPLIER}.hint`,
  });

  game.settings.register(MODULE_ID, SETTINGS.SHOW_BUTTONS, {
    name: `${MODULE_ID}.settings.${SETTINGS.SHOW_BUTTONS}.name`,
    default: true,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SHOW_BUTTONS}.hint`,
    onChange: debouncedReload,
  });

  game.settings.register(MODULE_ID, SETTINGS.SOUND_VOLUME, {
    name: `${MODULE_ID}.settings.${SETTINGS.SOUND_VOLUME}.name`,
    default: 0.8,
    type: Number,
    scope: 'client',
    range: { min: 0.0, max: 1, step: 0.1 },
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SOUND_VOLUME}.hint`,
  });

  game.settings.register(MODULE_ID, SETTINGS.SHOW_OTHERS_CONFETTI_SCALE, {
    name: `${MODULE_ID}.settings.${SETTINGS.SHOW_OTHERS_CONFETTI_SCALE}.name`,
    default: true,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SHOW_OTHERS_CONFETTI_SCALE}.hint`,
  });

  game.settings.register(MODULE_ID, SETTINGS.SHOW_OTHERS_GLITTER_STRENGTH, {
    name: `${MODULE_ID}.settings.${SETTINGS.SHOW_OTHERS_GLITTER_STRENGTH}.name`,
    default: true,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SHOW_OTHERS_GLITTER_STRENGTH}.hint`,
  });

  game.settings.registerMenu(MODULE_ID, SETTINGS.MENU_APPEARANCE, {
    name: `${MODULE_ID}.settings.${SETTINGS.MENU_APPEARANCE}.name`,
    label: `${MODULE_ID}.settings.${SETTINGS.MENU_APPEARANCE}.label`,
    hint: `${MODULE_ID}.settings.${SETTINGS.MENU_APPEARANCE}.hint`,
    icon: 'fas fa-bars',
    type: AppearanceSettings,
    restricted: false,
  });
};

export const registerAppearanceSettings = () => {
  game.settings.register(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_COLOR_BASE, {
    default: '',
    type: String,
    scope: 'client',
    config: false,
  });

  game.settings.register(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_STYLE_CHOICE, {
    default: CONFETTI_STYLES.default.key,
    type: String,
    scope: 'client',
    config: false,
  });

  game.settings.register(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_GLITTER_STRENGTH, {
    default: 128,
    type: Number,
    scope: 'client',
    config: false,
  });

  game.settings.register(MODULE_ID, SETTINGS.APPEARANCE.CONFETTI_SCALE, {
    default: 1,
    type: Number,
    scope: 'client',
    config: false,
  });
};
