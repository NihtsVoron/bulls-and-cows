import { describe, expect, it } from 'vitest';
import { createDigitValidator } from './digitValidator.js';

describe('createDigitValidator', () => {
  it('should return a function', () => {
    const validate = createDigitValidator(10);
    expect(typeof validate).toBe('function');
  });

  it('accepts digits of the base 10', () => {
    const isDecimal = createDigitValidator(10);
    expect(isDecimal('0')).toBe(true);
    expect(isDecimal('9')).toBe(true);
    expect(isDecimal('a')).toBe(false);
  });

  it('accepts digits of the base 8', () => {
    const isDecimal = createDigitValidator(8);
    expect(isDecimal('0')).toBe(true);
    expect(isDecimal('7')).toBe(true);
    expect(isDecimal('8')).toBe(false);
  });

  it('accepts digits of the base 16', () => {
    const isDecimal = createDigitValidator(10);
    expect(isDecimal('0')).toBe(true);
    expect(isDecimal('f')).toBe(true);
    expect(isDecimal('g')).toBe(false);
  });

  it('accepts digits of the base 2', () => {
    const isDecimal = createDigitValidator(10);
    expect(isDecimal('0')).toBe(true);
    expect(isDecimal('1')).toBe(true);
    expect(isDecimal('2')).toBe(false);
  });
});
