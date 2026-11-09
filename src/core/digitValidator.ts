import { alphabetOf, type Base } from './digits.js';

export const createDigitValidator = (_base: Base) => {
  const allowed = alphabetOf(_base);

  return (_char: string): boolean => {
    return allowed.indexOf(_char.toLowerCase()) >= 0;
  };
};
