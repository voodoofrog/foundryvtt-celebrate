import { MODULE_ID, CONFETTI_STRENGTH, SETTINGS } from './constants';

/**
 * @param {boolean} force Display even if debug mode is off
 *
 * @param {...any} args The output
 */
export const log = (force, ...args) => {
  const isDebugging = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_ID);
  if (force || CONFIG[MODULE_ID].debug === true || isDebugging === true) {
    console.log(MODULE_ID, '|', ...args);
  }
};

export const getSoundsMap = () => {
  return {
    [CONFETTI_STRENGTH.low]: game.settings.get(MODULE_ID, SETTINGS.SOUND_INTENSITY_LOW),
    [CONFETTI_STRENGTH.med]: game.settings.get(MODULE_ID, SETTINGS.SOUND_INTENSITY_MED),
    [CONFETTI_STRENGTH.high]: game.settings.get(MODULE_ID, SETTINGS.SOUND_INTENSITY_HIGH)
  };
};

/**
 *
 * @param {Function} func Callback function
 *
 * @param {string} scope Scope of the callback
 *
 * @param {Array} params Callback function parameters
 *
 * @returns {Function} function
 */
export function callback(func, scope, params) {
  let tween;
  params = params || [];
  return function () {
    if (!tween) {
      tween = this;
      params.push(tween);
    }
    func.apply(scope || tween, params);
  };
}
