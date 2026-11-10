import type { Evaluation, Guess, Secret } from './digits.js';

export const evaluateGuess = (secret: Secret, guess: Guess): Evaluation => {
  const secretDigits = secret.toLowerCase();
  const guessDigits = guess.toLowerCase();

  let bulls = 0;
  let cows = 0;
  for (let i = 0; i < guessDigits.length; i++) {
    if (guessDigits[i] == secretDigits[i]) bulls++;
    else if (secretDigits.includes(guessDigits[i]!)) cows++;
  }

  return { bulls, cows };
};
