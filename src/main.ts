import { generateSecret } from './core/generateSecret.js';
import {
  applyGuess,
  attemptCount,
  createGameState,
  DEFAULT_SETTINGS,
  elapsedMs,
  startRound,
  type GameState,
  type Settings,
} from './state/game.js';
import { insertRecord, type GameRecord } from './state/records.js';
import { readRecords, writeRecords } from './storage.js';
import { el, formatSeconds } from './ui/dom.js';
import { renderGame, renderSettings, renderWon } from './ui/screens.js';

let state: GameState = createGameState(DEFAULT_SETTINGS);
let records: readonly GameRecord[] = readRecords();
let timerId: number | undefined;

const root = el('div', { class: 'app' });
document.body.append(root);

const stopTimer = (): void => {
  if (timerId !== undefined) {
    window.clearInterval(timerId);
    timerId = undefined;
  }
};

const startTimer = (startedAt: number): void => {
  const label = root.querySelector('#timer');
  if (label === null) return;

  const tick = (): void => {
    label.textContent = formatSeconds(performance.now() - startedAt);
  };

  tick();
  timerId = window.setInterval(tick, 200);
};

const handleGuess = (guess: string): void => {
  const before = state;
  const after = applyGuess(before, guess, performance.now());

  if (before.phase === 'playing' && after.phase === 'won') {
    records = insertRecord(records, {
      settings: after.settings,
      attempts: attemptCount(after),
      timeMs: elapsedMs(after),
      playedAt: new Date().toISOString(),
    });
    writeRecords(records);
  }

  state = after;
  render();
};

const render = (): void => {
  stopTimer();

  const current = state;
  const view =
    current.phase === 'settings'
      ? renderSettings(current.settings, records, {
          onChange: (settings: Settings) => {
            state = createGameState(settings);
            render();
          },
          onStart: (settings: Settings) => {
            state = startRound(
              settings,
              generateSecret(settings.length, settings.base),
              performance.now(),
            );
            render();
          },
        })
      : current.phase === 'playing'
        ? renderGame(current, handleGuess)
        : renderWon(current, records, () => {
            state = createGameState(current.settings);
            render();
          });

  root.replaceChildren(view);
  root.querySelector('input')?.focus();

  if (current.phase === 'playing') startTimer(current.startedAt);
};

render();
