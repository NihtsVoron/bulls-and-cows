import type { Settings } from './state/game.js';
import type { GameRecord } from './state/records.js';

export const STORAGE_KEY = 'bulls-and-cows:records:v1';

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const isBase = (value: unknown): boolean =>
  value === 2 || value === 8 || value === 10 || value === 16;

const isSettings = (value: unknown): value is Settings => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return isNumber(candidate['length']) && isBase(candidate['base']);
};

const isRecord = (value: unknown): value is GameRecord => {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    isSettings(candidate['settings']) &&
    isNumber(candidate['attempts']) &&
    isNumber(candidate['timeMs']) &&
    typeof candidate['playedAt'] === 'string'
  );
};

export const readRecords = (): readonly GameRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw === null ? [] : JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as unknown[]).filter(isRecord) : [];
  } catch {
    return [];
  }
};

export const writeRecords = (records: readonly GameRecord[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // хранилище недоступно — игра продолжает работать
  }
};
