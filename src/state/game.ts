import type { Base, Evaluation, Guess, Secret } from '../core/digits.js';
import { alphabetOf, MAX_LENGTH, MIN_LENGTH } from '../core/digits.js';
import { evaluateGuess } from '../core/evaluator.js';
import { isValidGuess } from '../core/guessValidator.js';

export interface Settings {
  readonly length: number;
  readonly base: Base;
}

export const DEFAULT_SETTINGS: Settings = { length: 4, base: 10 };

export const maxLengthFor = (base: Base): number => Math.min(MAX_LENGTH, alphabetOf(base).length);

export const isLengthAllowed = (length: number, base: Base): boolean =>
  length >= MIN_LENGTH && length <= maxLengthFor(base);

export const withBase = (settings: Settings, base: Base): Settings => ({
  base,
  length: Math.min(settings.length, maxLengthFor(base)),
});

export const withLength = (settings: Settings, length: number): Settings =>
  isLengthAllowed(length, settings.base) ? { ...settings, length } : settings;

export interface HistoryEntry {
  readonly guess: Guess;
  readonly evaluation: Evaluation;
}

export interface SettingsState {
  readonly phase: 'settings';
  readonly settings: Settings;
}

export interface PlayingState {
  readonly phase: 'playing';
  readonly settings: Settings;
  readonly secret: Secret;
  readonly history: readonly HistoryEntry[];
  readonly startedAt: number;
}

export interface WonState extends Omit<PlayingState, 'phase'> {
  readonly phase: 'won';
  readonly finishedAt: number;
}

export type GameState = SettingsState | PlayingState | WonState;

export const createGameState = (settings: Settings): SettingsState => ({
  phase: 'settings',
  settings,
});

export const startRound = (settings: Settings, secret: Secret, now: number): PlayingState => ({
  phase: 'playing',
  settings,
  secret,
  history: [],
  startedAt: now,
});

export const hasGuess = (history: readonly HistoryEntry[], guess: Guess): boolean =>
  history.some((entry) => entry.guess === guess.toLowerCase());

export const applyGuess = (state: GameState, guess: Guess, now: number): GameState => {
  if (state.phase !== 'playing') return state;

  const { length, base } = state.settings;
  if (!isValidGuess(guess, length, base) || hasGuess(state.history, guess)) return state;

  const evaluation = evaluateGuess(state.secret, guess);
  const history = [...state.history, { guess: guess.toLowerCase(), evaluation }];

  return evaluation.bulls === length
    ? { ...state, phase: 'won', history, finishedAt: now }
    : { ...state, history };
};

export const attemptCount = (state: PlayingState | WonState): number => state.history.length;

export const elapsedMs = (state: WonState): number => state.finishedAt - state.startedAt;
