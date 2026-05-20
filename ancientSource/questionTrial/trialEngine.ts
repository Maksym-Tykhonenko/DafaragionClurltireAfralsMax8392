import { TrialQuestion } from '../dataBridge/types';

export type TrialState = {
  index: number;
  selectedKey: string | null;
  locked: boolean;
  correctCount: number;
  bestCombo: number;
  combo: number;
  questions: TrialQuestion[];
  timeLeft: number;
  finished: boolean;
};

export function buildTrialState(questions: TrialQuestion[], perQ: number): TrialState {
  return {
    index: 0,
    selectedKey: null,
    locked: false,
    correctCount: 0,
    bestCombo: 0,
    combo: 0,
    questions,
    timeLeft: perQ,
    finished: false,
  };
}

export function rankFor(percent: number): string {
  if (percent >= 90) return 'Atlas Master';
  if (percent >= 75) return 'Lore Scholar';
  if (percent >= 50) return 'Wyrm Initiate';
  if (percent >= 25) return 'Atlas Novice';
  return 'Lantern Bearer';
}