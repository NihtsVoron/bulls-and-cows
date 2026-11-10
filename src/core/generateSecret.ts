import type { Base, Secret } from './digits.js';

export const generateSecret = (
  _length: number,
  _base: Base,
  _random: () => number = Math.random,
): Secret => {
  throw new Error('Not implemented');
};
