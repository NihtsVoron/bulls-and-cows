import { BASE_LABELS } from '../core/digits.js';
import type { Settings } from '../state/game.js';
import { recordsFor, type GameRecord } from '../state/records.js';

type Prop = string | number | boolean | EventListener;

export const el = <Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  props: Readonly<Record<string, Prop>> = {},
  ...children: (Node | string)[]
): HTMLElementTagNameMap[Tag] => {
  const element = document.createElement(tag);

  for (const [key, value] of Object.entries(props)) {
    if (typeof value === 'function') {
      element.addEventListener(key.replace(/^on/, '').toLowerCase(), value);
    } else if (typeof value === 'boolean') {
      if (value) element.setAttribute(key, '');
    } else {
      element.setAttribute(key, String(value));
    }
  }

  element.append(...children);
  return element;
};

export const formatSeconds = (ms: number): string => `${(ms / 1000).toFixed(1)} с`;

export const renderRecords = (records: readonly GameRecord[], settings: Settings): HTMLElement => {
  const rows = recordsFor(records, settings);
  const heading = el('h2', {}, `Рекорды: ${settings.length} цифр, ${BASE_LABELS[settings.base]}`);

  if (rows.length === 0) {
    return el('section', {}, heading, el('p', {}, 'Пока нет результатов'));
  }

  return el(
    'section',
    {},
    heading,
    el(
      'ol',
      {},
      ...rows.map((row) => el('li', {}, `${row.attempts} попыток, ${formatSeconds(row.timeMs)}`)),
    ),
  );
};
