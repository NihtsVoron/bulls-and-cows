import { describe, expect, it } from 'vitest';
import { generateSecret } from './generateSecret.js';

const sequence = (values: readonly number[]): (() => number) => {
  let index = 0;
  return () => values[index++] ?? 0;
};

describe('generateSecret', () => {
  it('returns a secret of the requested length', () => {
    expect(generateSecret(4, 10)).toHaveLength(4);
  });

  it('contains only unique digits of the given base', () => {
    const secret = generateSecret(6, 10);
    expect(new Set(secret).size).toBe(6);
    [...secret].forEach((digit) => expect('0123456789').toContain(digit));
  });

  it('respects the requested base', () => {
    const secret = generateSecret(2, 2);
    expect(secret).toMatch(/^[01]{2}$/);
  });

  it('throws when length exceeds the alphabet size', () => {
    expect(() => generateSecret(3, 2)).toThrow(RangeError);
  });

  it('produces a deterministic secret from an injected random source', () => {
    expect(generateSecret(4, 10, sequence([0, 0, 0, 0]))).toBe('0123');
    expect(generateSecret(2, 10, sequence([0.99, 0.5]))).toBe('94');
    expect(generateSecret(4, 10, sequence([0.999, 0.999, 0.999, 0.999]))).toBe('9876');
  });

  it('allows a leading zero', () => {
    expect(generateSecret(4, 10, sequence([0, 0, 0, 0]))[0]).toBe('0');
  });
});
