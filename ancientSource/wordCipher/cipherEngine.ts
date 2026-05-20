import { CipherWord } from '../dataBridge/types';

export type Slot = {
  letter: string | null;
  index: number;
  revealedByHint: boolean;
  locked: boolean;
};

export function buildSlots(word: CipherWord): Slot[] {
  return word.answer.split('').map((ch, i) => {
    const maskedChar = word.masked[i];
    const visible = !!maskedChar && maskedChar !== '_' && maskedChar.toUpperCase() === ch.toUpperCase();
    return {
      letter: visible ? ch : null,
      index: i,
      revealedByHint: false,
      locked: visible,
    };
  });
}

export type HintKey = 'clue' | 'reveal1' | 'reveal2';

export type HintState = {
  clueShown: boolean;
  reveal1Used: boolean;
  reveal2Used: boolean;
};

export const initialHintState: HintState = {
  clueShown: false,
  reveal1Used: false,
  reveal2Used: false,
};

export function pickHiddenIndex(slots: Slot[], word: CipherWord, rng = Math.random): number | null {
  // Choose a slot that is still hidden (no letter and not yet revealed).
  const candidates = slots
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.letter == null);
  if (candidates.length === 0) return null;
  const pick = candidates[Math.floor(rng() * candidates.length)];
  return pick.i;
}

export function applyReveal(slots: Slot[], word: CipherWord): Slot[] {
  const idx = pickHiddenIndex(slots, word);
  if (idx == null) return slots;
  return slots.map((s, i) =>
    i === idx ? { ...s, letter: word.answer[i], revealedByHint: true } : s,
  );
}

export function hasHiddenLetters(slots: Slot[]): boolean {
  return slots.some(s => s.letter == null);
}

export function renderMasked(slots: Slot[]): string {
  return slots.map(s => (s.letter == null ? '_' : s.letter)).join('');
}

export function checkAnswer(input: string, answer: string): boolean {
  return input.replace(/\s+/g, '').toUpperCase() === answer.toUpperCase();
}
