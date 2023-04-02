export const MODULE_ID = 'celebrate';
export const WINDOW_ID = 'confetti';

export const CONFETTI_STRENGTH = {
  low: 0,
  med: 1,
  high: 2,
};

export const SOUNDS = {
  [CONFETTI_STRENGTH.low]: `modules/${MODULE_ID}/assets/sounds/foley_cork_pull_out_from_wine_bottle_004.mp3`,
  [CONFETTI_STRENGTH.med]: `modules/${MODULE_ID}/assets/sounds/zapsplat_household_cork_pop_champagne_outside.mp3`,
  [CONFETTI_STRENGTH.high]: `modules/${MODULE_ID}/assets/sounds/food_drink_champagne_cork_pop_pour.mp3`,
};

export const SETTINGS = {
  MENU_APPEARANCE: 'appearanceMenu',
  GM_ONLY: 'gmOnly',
  FIRE_RATE_LIMIT: 'fireRateLimit',
  CONFETTI_MULTIPLIER: 'confettiMultiplier',
  SHOW_BUTTONS: 'showButtons',
  SOUND_VOLUME: 'soundVolume',
  SHOW_OTHERS_CONFETTI_SCALE: 'showOthersConfettiScale',
  SHOW_OTHERS_GLITTER_STRENGTH: 'showOthersGlitterStrength',
  APPEARANCE: {
    CONFETTI_STYLE_CHOICE: 'confettiStyleChoice',
    CONFETTI_COLOR_BASE: 'confettiColorBase',
    CONFETTI_GLITTER_STRENGTH: 'confettiGlitterStrength',
    CONFETTI_SCALE: 'confettiScale',
  },
};

export const TEMPLATES = {
  APPEARANCE_SETTINGS: `modules/${MODULE_ID}/templates/appearance-settings.hbs`,
};

export const CONFETTI_STYLES = {
  default: {
    key: 'default',
    translation: `${MODULE_ID}.settings.appearance.${SETTINGS.APPEARANCE.CONFETTI_STYLE_CHOICE}.choices.default`,
  },
  base: {
    key: 'base',
    translation: `${MODULE_ID}.settings.appearance.${SETTINGS.APPEARANCE.CONFETTI_STYLE_CHOICE}.choices.base`,
  },
  glitter: {
    key: 'glitter',
    translation: `${MODULE_ID}.settings.appearance.${SETTINGS.APPEARANCE.CONFETTI_STYLE_CHOICE}.choices.glitter`,
  },
  baseGlitter: {
    key: 'baseGlitter',
    translation: `${MODULE_ID}.settings.appearance.${SETTINGS.APPEARANCE.CONFETTI_STYLE_CHOICE}.choices.baseGlitter`,
  },
};
