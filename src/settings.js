import { TJSGameSettings } from '#runtime/svelte/store/fvtt/settings';
import { EditAppearanceButton } from './classes/EditAppearanceButton';
import { CONFETTI_STRENGTH, CONFETTI_STYLES, CONFETTI_TEXTURES, MODULE_ID, SETTINGS, SOUNDS } from './constants';

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
    onChange: debouncedReload
  });

  game.settings.register(MODULE_ID, SETTINGS.FIRE_RATE_LIMIT, {
    name: `${MODULE_ID}.settings.${SETTINGS.FIRE_RATE_LIMIT}.name`,
    default: 5,
    range: { min: 0, max: 10, step: 1 },
    type: Number,
    scope: 'world',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.FIRE_RATE_LIMIT}.hint`
  });

  game.settings.register(MODULE_ID, SETTINGS.CONFETTI_MULTIPLIER, {
    name: `${MODULE_ID}.settings.${SETTINGS.CONFETTI_MULTIPLIER}.name`,
    default: 1,
    type: Number,
    scope: 'client',
    range: { min: 0.1, max: 3, step: 0.1 },
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.CONFETTI_MULTIPLIER}.hint`
  });

  game.settings.register(MODULE_ID, SETTINGS.SHOW_BUTTONS, {
    name: `${MODULE_ID}.settings.${SETTINGS.SHOW_BUTTONS}.name`,
    default: true,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SHOW_BUTTONS}.hint`,
    onChange: debouncedReload
  });

  game.settings.register(MODULE_ID, SETTINGS.SOUND_VOLUME, {
    name: `${MODULE_ID}.settings.${SETTINGS.SOUND_VOLUME}.name`,
    default: 0.8,
    type: Number,
    scope: 'client',
    range: { min: 0.0, max: 1, step: 0.1 },
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SOUND_VOLUME}.hint`
  });

  game.settings.register(MODULE_ID, SETTINGS.SOUND_INTENSITY_HIGH, {
    name: `${MODULE_ID}.settings.${SETTINGS.SOUND_INTENSITY_HIGH}.name`,
    default: SOUNDS[CONFETTI_STRENGTH.high],
    type: String,
    scope: 'world',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SOUND_INTENSITY_HIGH}.hint`,
    filePicker: 'audio'
  });

  game.settings.register(MODULE_ID, SETTINGS.SOUND_INTENSITY_MED, {
    name: `${MODULE_ID}.settings.${SETTINGS.SOUND_INTENSITY_MED}.name`,
    default: SOUNDS[CONFETTI_STRENGTH.med],
    type: String,
    scope: 'world',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SOUND_INTENSITY_MED}.hint`,
    filePicker: 'audio'
  });

  game.settings.register(MODULE_ID, SETTINGS.SOUND_INTENSITY_LOW, {
    name: `${MODULE_ID}.settings.${SETTINGS.SOUND_INTENSITY_LOW}.name`,
    default: SOUNDS[CONFETTI_STRENGTH.low],
    type: String,
    scope: 'world',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SOUND_INTENSITY_LOW}.hint`,
    filePicker: 'audio'
  });

  game.settings.register(MODULE_ID, SETTINGS.SHOW_OTHERS_CONFETTI_SCALE, {
    name: `${MODULE_ID}.settings.${SETTINGS.SHOW_OTHERS_CONFETTI_SCALE}.name`,
    default: true,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SHOW_OTHERS_CONFETTI_SCALE}.hint`
  });

  game.settings.register(MODULE_ID, SETTINGS.SHOW_OTHERS_GLITTER_STRENGTH, {
    name: `${MODULE_ID}.settings.${SETTINGS.SHOW_OTHERS_GLITTER_STRENGTH}.name`,
    default: true,
    type: Boolean,
    scope: 'client',
    config: true,
    hint: `${MODULE_ID}.settings.${SETTINGS.SHOW_OTHERS_GLITTER_STRENGTH}.hint`
  });

  game.settings.register(MODULE_ID, SETTINGS.EXTRA_TEXTURES, {
    default: [],
    type: Array,
    scope: 'world',
    config: false
  });

  game.settings.registerMenu(MODULE_ID, SETTINGS.MENU_APPEARANCE, {
    name: `${MODULE_ID}.settings.${SETTINGS.MENU_APPEARANCE}.name`,
    label: `${MODULE_ID}.settings.${SETTINGS.MENU_APPEARANCE}.label`,
    hint: `${MODULE_ID}.settings.${SETTINGS.MENU_APPEARANCE}.hint`,
    icon: 'fas fa-bars',
    type: EditAppearanceButton,
    restricted: false
  });
};

export const appearanceSettings = new TJSGameSettings(MODULE_ID);

export const registerAppearanceSettings = async () => {
  await appearanceSettings.registerAll([
    {
      namespace: MODULE_ID,
      key: SETTINGS.APPEARANCE.CONFETTI_COLOR_BASE,
      options: {
        default: '',
        type: String,
        scope: 'client',
        config: false
      }
    },
    {
      namespace: MODULE_ID,
      key: SETTINGS.APPEARANCE.CONFETTI_STYLE_CHOICE,
      options: {
        default: CONFETTI_STYLES.default.key,
        type: String,
        scope: 'client',
        config: false
      }
    },
    {
      namespace: MODULE_ID,
      key: SETTINGS.APPEARANCE.CONFETTI_GLITTER_STRENGTH,
      options: {
        default: 128,
        type: Number,
        scope: 'client',
        config: false
      }
    },
    {
      namespace: MODULE_ID,
      key: SETTINGS.APPEARANCE.CONFETTI_SCALE,
      options: {
        default: 1,
        type: Number,
        scope: 'client',
        config: false
      }
    },
    {
      namespace: MODULE_ID,
      key: SETTINGS.APPEARANCE.CONFETTI_TEXTURE,
      options: {
        default: CONFETTI_TEXTURES.classic.key,
        type: String,
        scope: 'client',
        config: false
      }
    }
  ]);
};
