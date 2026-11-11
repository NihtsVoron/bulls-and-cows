import { BASE_LABELS, BASES, MAX_LENGTH, MIN_LENGTH, type Base } from '../core/digits.js';
import { createDigitValidator } from '../core/digitValidator.js';
import { isValidGuess } from '../core/guessValidator.js';
import { countPossibleSecrets } from '../core/permutations.js';
import {
  attemptCount,
  elapsedMs,
  hasGuess,
  isLengthAllowed,
  withBase,
  withLength,
  type HistoryEntry,
  type PlayingState,
  type Settings,
  type WonState,
} from '../state/game.js';
import type { GameRecord } from '../state/records.js';
import { el, formatSeconds, renderRecords } from './dom.js';

export interface SettingsHandlers {
  readonly onChange: (settings: Settings) => void;
  readonly onStart: (settings: Settings) => void;
}

const selectedNumber = (event: Event): number =>
  Number((event.currentTarget as HTMLSelectElement).value);

export const renderSettings = (
  settings: Settings,
  records: readonly GameRecord[],
  handlers: SettingsHandlers,
): HTMLElement => {
  const baseSelect = el(
    'select',
    {
      id: 'base',
      onchange: (event: Event) =>
        handlers.onChange(withBase(settings, selectedNumber(event) as Base)),
    },
    ...BASES.map((base) =>
      el(
        'option',
        { value: base, selected: base === settings.base },
        `${BASE_LABELS[base]} (${base})`,
      ),
    ),
  );

  const lengths = Array.from(
    { length: MAX_LENGTH - MIN_LENGTH + 1 },
    (_, index) => MIN_LENGTH + index,
  );

  const lengthSelect = el(
    'select',
    {
      id: 'length',
      onchange: (event: Event) => handlers.onChange(withLength(settings, selectedNumber(event))),
    },
    ...lengths.map((length) =>
      el(
        'option',
        {
          value: length,
          selected: length === settings.length,
          disabled: !isLengthAllowed(length, settings.base),
        },
        String(length),
      ),
    ),
  );

  return el(
    'section',
    {},
    el('h1', {}, 'Bulls and Cows'),
    el('label', { for: 'base' }, 'Система счисления'),
    baseSelect,
    el('label', { for: 'length' }, 'Длина числа'),
    lengthSelect,
    el(
      'p',
      {},
      `Возможных секретных чисел: ${countPossibleSecrets(settings.length, settings.base)}`,
    ),
    el('button', { type: 'button', onclick: () => handlers.onStart(settings) }, 'Начать игру'),
    renderRecords(records, settings),
  );
};

const renderHistory = (history: readonly HistoryEntry[]): HTMLElement =>
  el(
    'ol',
    { class: 'history' },
    ...history.map((entry) =>
      el(
        'li',
        {},
        `${entry.guess}: быков ${entry.evaluation.bulls}, коров ${entry.evaluation.cows}`,
      ),
    ),
  );

export const renderGame = (state: PlayingState, onGuess: (guess: string) => void): HTMLElement => {
  const { length, base } = state.settings;
  const isValidDigit = createDigitValidator(base);
  const notice = el('p', { role: 'status' });

  const input = el('input', {
    type: 'text',
    maxlength: length,
    autocomplete: 'off',
    placeholder: `${length} разных цифр`,
    oninput: (event: Event) => {
      const field = event.currentTarget as HTMLInputElement;
      const filtered = [...field.value]
        .filter((char) => isValidDigit(char))
        .join('')
        .toLowerCase()
        .slice(0, length);

      if (filtered !== field.value) field.value = filtered;
      notice.textContent = '';
    },
  });

  const form = el(
    'form',
    {
      onsubmit: (event: Event) => {
        event.preventDefault();
        const guess = input.value;

        if (!isValidGuess(guess, length, base)) {
          notice.textContent = `Введите ${length} разных цифр (${BASE_LABELS[base]})`;
          return;
        }

        if (hasGuess(state.history, guess)) {
          notice.textContent = 'Такая попытка уже была';
          return;
        }

        onGuess(guess);
      },
    },
    input,
    el('button', { type: 'submit' }, 'Проверить'),
  );

  return el(
    'section',
    {},
    el('h1', {}, 'Bulls and Cows'),
    el('p', {}, `Режим: ${length} цифр, ${BASE_LABELS[base]}. Попыток: ${attemptCount(state)}`),
    el('p', { id: 'timer', class: 'timer' }, formatSeconds(0)),
    form,
    notice,
    renderHistory(state.history),
  );
};

export const renderWon = (
  state: WonState,
  records: readonly GameRecord[],
  onNewGame: () => void,
): HTMLElement =>
  el(
    'section',
    {},
    el('h1', {}, 'Вы угадали!'),
    el(
      'p',
      {},
      `Секрет: ${state.secret}. Попыток: ${attemptCount(state)}, время: ${formatSeconds(elapsedMs(state))}`,
    ),
    renderHistory(state.history),
    renderRecords(records, state.settings),
    el('button', { type: 'button', onclick: onNewGame }, 'Новая игра'),
  );
