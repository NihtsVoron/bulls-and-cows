import { describe, expect, it } from 'vitest';
import type { Base } from './digits.js';
import { countPossibleSecrets } from './permutations.js';

describe('countPossibleSecrets', () => {
  it.each([
    [0, 10, 1],
    [2, 2, 2],
    [3, 8, 336],
    [4, 10, 5040],
    [6, 10, 151200],
    [6, 16, 5765760],
    [10, 10, 3628800],
  ])('length %i in base %i gives %i', (length, base, expected) => {
    expect(countPossibleSecrets(length, base as Base)).toBe(expected);
  });

  it('returns zero when the length exceeds the alphabet', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
  });

  it('returns the same value on repeated calls', () => {
    expect(countPossibleSecrets(4, 10)).toBe(countPossibleSecrets(4, 10));
  });
});
