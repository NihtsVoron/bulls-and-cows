import { alphabetOf, type Base } from './digits.js';
import { memoize } from './memoize.js';

const countArrangements: (available: number, needed: number) => number = memoize(
  (available: number, needed: number): number => {
    if (needed > available) return 0;
    if (needed === 0) return 1;
    return available * countArrangements(available - 1, needed - 1);
  },
);

export const countPossibleSecrets = (length: number, base: Base): number =>
  countArrangements(alphabetOf(base).length, length);
