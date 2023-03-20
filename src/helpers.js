import { MODULE_ID } from './constants';

/**
 * @param {boolean} force Display even if debug mode is off
 *
 * @param {...any} args The output
 */
export function log(force, ...args) {
  const isDebugging = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_ID);
  if (force || CONFIG[MODULE_ID].debug === true || isDebugging === true) {
    console.log(MODULE_ID, '|', ...args);
  }
}

/**
 * Replacement for _.random
 *
 * @param {number} a Upper bound
 *
 * @param {number} b Lower bound
 *
 * @returns {number} A random result between the bounds
 */
export const random = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};

const _convertHexUnitTo256 = (hexStr) => {
  return parseInt(hexStr.repeat(2 / hexStr.length), 16);
};

/**
 * turn hex rgba into rgba string
 *
 * @param {string} hex 8 long hex value in string form, eg: "#123456ff"
 *
 * @returns {Array} Array of rgba[r, g, b, a]
 */
export const hexToRGBA = (hex) => {
  const hexArr = hex.slice(1).match(new RegExp('.{2}', 'g'));
  const [r, g, b, a] = hexArr.map(_convertHexUnitTo256);
  return [r, g, b, Math.round((a / 256 + Number.EPSILON) * 100) / 100];
};

/**
 * Comstrain an integer between two bounds (inclusive). If the input number
 * is a string or float it will be converted to an integer.
 *
 * @param {number | string} int The integer to constrain
 *
 * @param {number} min The lower bound
 *
 * @param {number} max The upper bound
 *
 * @returns {number} The constrained integer
 */
export const constrainIntToBounds = (int, min = 0, max = 255) => {
  return Math.min(Math.max(parseInt(int), min), max);
};
