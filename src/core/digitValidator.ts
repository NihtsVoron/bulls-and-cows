import type { Base } from './digits.js';

export const createDigitValidator =
  (_base: Base) =>
  (_char: string): boolean => {
    throw new Error('Not implemented');
  };
