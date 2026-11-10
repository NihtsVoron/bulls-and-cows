import type { Base, Secret } from './digits.js';
import { alphabetOf } from './digits.js';

export const generateSecret = (
  length: number,
  base: Base,
  random: () => number = Math.random,
): Secret => {
  let alphabet = alphabetOf(base);

  if (length > alphabet.length) {
    throw new RangeError(`base ${base} cannot provide ${length} unique digits`);
  }

  let result = '';

  for (let i = 0; i < length; i++) {
    const index = Math.floor(random() * alphabet.length);
    const digit = alphabet[index]!;
    result = result + digit;
    alphabet = alphabet.replace(digit, '');
  }

  return result;
};
