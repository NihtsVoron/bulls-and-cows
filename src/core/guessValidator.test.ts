import { describe, expect, it } from 'vitest';
import { isValidGuess } from './guessValidator.js';

describe('isValidGuess', () => {
  it('should return a function', () => {
    const validGuess = isValidGuess('123', 3, 10);
    expect(typeof validGuess).toBe('function');
  });

  it('accepts a guess of the right length with unique digits', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });

  it('rejects a guess of the wrong length', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
  });

  it('rejects characters outside the base', () => {
    expect(isValidGuess('12a4', 4, 10)).toBe(false);
    expect(isValidGuess('10', 2, 2)).toBe(true);
    expect(isValidGuess('12', 2, 2)).toBe(false);
  });

  it('rejects repeated digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
    expect(isValidGuess('11', 2, 2)).toBe(false);
  });

  it('treats hex digits case-insensitively when detecting repeats', () => {
    expect(isValidGuess('aA01', 4, 16)).toBe(false);
    expect(isValidGuess('aB01', 4, 16)).toBe(true);
  });

  it('allows a leading zero', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('rejects an empty guess', () => {
    expect(isValidGuess('', 2, 10)).toBe(false);
  });
});
