import { describe, expect, it, vi } from 'vitest';
import { memoize } from './memoize.js';

describe('memoize', () => {
  it('calls the wrapped function once per argument set', () => {
    const spy = vi.fn((value: number) => value * 2);
    const memoized = memoize(spy);
    expect([memoized(2), memoized(2), memoized(3)]).toEqual([4, 4, 6]);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('distinguishes different argument lists', () => {
    const spy = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(spy);
    expect(memoized(1, 2)).toBe(3);
    expect(memoized(2, 1)).toBe(3);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
