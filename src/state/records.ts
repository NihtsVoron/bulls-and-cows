import type { Settings } from './game.js';

export interface GameRecord {
  readonly settings: Settings;
  readonly attempts: number;
  readonly timeMs: number;
  readonly playedAt: string;
}

export const MAX_RECORDS = 10;

const sameSettings = (a: Settings, b: Settings): boolean =>
  a.length === b.length && a.base === b.base;

const compareRecords = (a: GameRecord, b: GameRecord): number =>
  a.attempts - b.attempts || a.timeMs - b.timeMs;

export const recordsFor = (
  records: readonly GameRecord[],
  settings: Settings,
): readonly GameRecord[] =>
  records.filter((record) => sameSettings(record.settings, settings)).sort(compareRecords);

export const insertRecord = (
  records: readonly GameRecord[],
  record: GameRecord,
): readonly GameRecord[] => [
  ...records.filter((existing) => !sameSettings(existing.settings, record.settings)),
  ...recordsFor([...records, record], record.settings).slice(0, MAX_RECORDS),
];
