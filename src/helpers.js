import { MODULE_ID } from './constants';

/**
 * @param {boolean} force Display even if debug mode is off
 *
 * @param {...any} args The output
 */
export function log(force, ...args) {
  if (force || CONFIG[MODULE_ID].debug === true) {
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
