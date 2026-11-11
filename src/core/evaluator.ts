import type { Evaluation, Guess, Secret } from './digits.js';

export const evaluateGuess = (secret: Secret, guess: Guess): Evaluation => {
  const secretDigits = [...secret.toLowerCase()];
  const guessDigits = [...guess.toLowerCase()];
  const secretSet = new Set(secretDigits);

  const bulls = guessDigits.filter((digit, position) => digit === secretDigits[position]).length;
  const cows = guessDigits.filter(
    (digit, position) => digit !== secretDigits[position] && secretSet.has(digit),
  ).length;

  return { bulls, cows };
};
