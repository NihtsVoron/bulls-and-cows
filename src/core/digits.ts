export const DIGITS = {
  2: '01',
  8: '01234567',
  10: '0123456789',
  16: '0123456789abcdef',
} as const;

export type Base = keyof typeof DIGITS;
export type Secret = string;
export type Guess = string;

export interface Evaluation {
  readonly bulls: number;
  readonly cows: number;
}

export const BASES: readonly Base[] = [2, 8, 10, 16];
export const BASE_LABELS: Readonly<Record<Base, string>> = {
  2: 'bin',
  8: 'oct',
  10: 'dec',
  16: 'hex',
};

export const MIN_LENGTH = 2;
export const MAX_LENGTH = 6;

export const alphabetOf = (base: Base): string => DIGITS[base];
