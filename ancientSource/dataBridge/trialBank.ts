import rawTrial from '../../darpongrodainreni/kawqriz';
import { TrialQuestion } from './types';

function softenPrompt(text: string): string {
  return text.replace(/“/g, '"').replace(/”/g, '"').replace(/’/g, "'").trim();
}

export const trialBank: TrialQuestion[] = (rawTrial as any[]).map(q => ({
  id: q.id,
  prompt: softenPrompt(q.question),
  options: q.options,
  correctKey: q.correct,
}));

export function pickTrialSet(count: number): TrialQuestion[] {
  const copy = [...trialBank];
  const out: TrialQuestion[] = [];
  while (out.length < count && copy.length) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

export const TRIAL_LENGTH = 6;
export const TRIAL_SECONDS_PER_Q = 20;
