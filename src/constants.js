export const MODULE_ID = 'celebrate';
export const MODULE_ABBREV = 'CEL';
export const WINDOW_ID = 'confetti';

export const ConfettiStrength = {
  low: 0,
  med: 1,
  high: 2,
};

export const SOUNDS = {
  [ConfettiStrength.low]: `modules/${MODULE_ID}/assets/sounds/foley_cork_pull_out_from_wine_bottle_004.mp3`,
  [ConfettiStrength.med]: `modules/${MODULE_ID}/assets/sounds/zapsplat_household_cork_pop_champagne_outside.mp3`,
  [ConfettiStrength.high]: `modules/${MODULE_ID}/assets/sounds/food_drink_champagne_cork_pop_pour.mp3`,
};

export const MySettings = {
  GmOnly: 'gm-only',
  ConfettiMultiplier: 'confetti-multiplier',
  ConfettiScale: 'confetti-scale',
  ConfettiColorBase: 'confetti-color-base',
  ConfettiStyleChoice: 'confetti-style-choice',
  ConfettiGlitterDeviation: 'confetti-glitter-deviation',
  Mute: 'mute',
  RapidFireLimit: 'rapid-fire-limit',
  ShowButton: 'show-button',
  AllowOtherConfettiScale: 'allow-other-confetti-scale',
  AllowOtherConfettiDeviation: 'allow-other-confetti-deviation',
  AppearanceMenu: 'confetti-appearance-menu',
};

export const TEMPLATES = {
  APPEARANCE_SETTINGS: `modules/${MODULE_ID}/templates/appearance-settings.hbs`,
};
