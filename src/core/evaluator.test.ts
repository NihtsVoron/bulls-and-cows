import { describe, expect, it } from 'vitest';
import { evaluateGuess } from './evaluator.js';

describe('evaluateGuess', () => {
  it('detects a full match', () => {
    expect(evaluateGuess('1234', '1234')).toEqual({ bulls: 4, cows: 0 });
  });

  it('counts cows when digits are in the wrong positions', () => {
    expect(evaluateGuess('1234', '4321')).toEqual({ bulls: 0, cows: 4 });
  });

  it('counts bulls and cows together', () => {
    expect(evaluateGuess('1234', '1324')).toEqual({ bulls: 2, cows: 2 });
    expect(evaluateGuess('4271', '1234')).toEqual({ bulls: 1, cows: 2 });
    expect(evaluateGuess('1234', '1256')).toEqual({ bulls: 2, cows: 0 });
    expect(evaluateGuess('1234', '5678')).toEqual({ bulls: 0, cows: 0 });
  });

  it('supports a leading zero', () => {
    expect(evaluateGuess('0123', '3210')).toEqual({ bulls: 0, cows: 4 });
  });

  it('is case-insensitive for hex digits', () => {
    expect(evaluateGuess('a1b2', 'A1B2')).toEqual({ bulls: 4, cows: 0 });
    expect(evaluateGuess('a1b2', 'b2a1')).toEqual({ bulls: 0, cows: 4 });
  });
});
