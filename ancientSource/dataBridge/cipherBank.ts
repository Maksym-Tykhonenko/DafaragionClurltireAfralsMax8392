import rawCipher from '../../darpongrodainreni/forsdhtn';
import { CipherWord } from './types';

const eras = ['Ancient Lore', 'Medieval Tales', 'Sumerian Echo', 'Imperial Era', 'Northern Saga'];

function maskWord(answer: string, mask: string): string {
  const flat = mask.replace(/\s+/g, '');
  if (flat.length === answer.length) return flat;
  let s = '';
  for (let i = 0; i < answer.length; i++) {
    s += i === 0 || i === answer.length - 1 ? answer[i] : '_';
  }
  return s;
}

function sanitizeClue(s: string): string {
  return s
    .replace(/\bMythical fire creature\b/i, 'Legendary winged guardian')
    .replace(/\bMythical protector\b/i, 'Sacred temple sentinel')
    .replace(/\bArmor-like dragon skin\b/i, 'Plated mythic armor')
    .trim();
}

export const cipherBank: CipherWord[] = (rawCipher as any[]).map((w, idx) => ({
  id: w.id,
  answer: w.fullWord,
  masked: maskWord(w.fullWord, w.puzzle),
  clue: sanitizeClue(w.hint),
  era: eras[idx % eras.length],
}));

export function pickCipherSet(count: number): CipherWord[] {
  const copy = [...cipherBank];
  const out: CipherWord[] = [];
  while (out.length < count && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export const CIPHER_LENGTH = 7;
export const CIPHER_SECONDS_PER_WORD = 90;
export const CIPHER_HINTS_PER_WORD = 3;
