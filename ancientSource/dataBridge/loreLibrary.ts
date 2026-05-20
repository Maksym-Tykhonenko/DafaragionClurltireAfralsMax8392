import rawLore from '../../darpongrodainreni/sotriestes';
import { LoreRecord } from './types';

const gradientCycle = [
  'emberFlare',
  'amberCrown',
  'oxbloodSilk',
  'azureLore',
  'cinderGreen',
  'violetMyth',
  'twilightDune',
  'pyriteDusk',
  'rubyAsh',
  'jadeMoss',
];

function sanitize(input: string): string {
  return input
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/’/g, "'")
    .replace(/\bDragon Queen\b/g, 'Highland Queen')
    .replace(/\bdragons\b/gi, match => match)
    .trim();
}

function pickQuote(body: string): string {
  const segments = body.split(/(?<=\.) /);
  let best = segments[0] ?? body;
  for (const seg of segments) {
    if (seg.length > best.length && seg.length < 220) best = seg;
  }
  return best.trim();
}

function reframeTitle(title: string): string {
  return title.replace(/\bDragon\b/g, 'Wyrm').replace(/  +/g, ' ').trim();
}

export const loreLibrary: LoreRecord[] = (rawLore as any[]).map((it, idx) => ({
  id: `lore-${it.id}`,
  title: reframeTitle(sanitize(it.title)),
  hookLine: sanitize(it.question),
  readingTime: it.readingTime,
  body: sanitize(it.content),
  quote: sanitize(pickQuote(it.content)),
  gradientKey: gradientCycle[idx % gradientCycle.length],
}));

export const loreById = new Map(loreLibrary.map(l => [l.id, l]));

export const featuredLore = loreLibrary[0];
