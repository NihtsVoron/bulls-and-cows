import type { Base, Guess } from './digits.js';
import { createDigitValidator } from './digitValidator.js';

export const isValidGuess = (_guess: Guess, _length: number, _base: Base): boolean => {
  const chars = _guess.toLowerCase();
  const digitValidator = createDigitValidator(_base);

  const unique = new Set(chars);
  let result = chars.length == _length && unique.size == _length;

  for (let i = 0; i < chars.length; i++) result = result && digitValidator(chars.charAt(i));

  return result;
};
