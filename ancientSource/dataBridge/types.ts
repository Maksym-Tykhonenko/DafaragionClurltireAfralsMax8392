export type RelicCategory = 'temples' | 'statues' | 'cities';

export type RelicTimelineEntry = {
  year: string;
  event: string;
};

export type RelicRecord = {
  id: string;
  name: string;
  category: RelicCategory;
  region: string;
  country: string;
  coordinates: { lat: number; lng: number };
  loreText: string;
  historyText: string;
  timeline: RelicTimelineEntry[];
  image: number;
  gradientKey: string;
};

export type LoreRecord = {
  id: string;
  title: string;
  hookLine: string;
  readingTime: string;
  body: string;
  quote: string;
  gradientKey: string;
};

export type TrialQuestion = {
  id: number;
  prompt: string;
  options: { key: string; text: string }[];
  correctKey: string;
};

export type CipherWord = {
  id: number;
  answer: string;
  masked: string;
  clue: string;
  era: string;
};
