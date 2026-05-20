import rawAtlas from '../../darpongrodainreni/tempsStutesCitis';
import { RelicCategory, RelicRecord } from './types';

const gradientByCategory: Record<RelicCategory, string[]> = {
  temples: ['emberFlare', 'oxbloodSilk', 'rubyAsh'],
  statues: ['amberCrown', 'pyriteDusk', 'cinderGreen'],
  cities: ['azureLore', 'violetMyth', 'twilightDune'],
};

const regionByCountry: Record<string, string> = {
  Thailand: 'Asia',
  Japan: 'Asia',
  Taiwan: 'Asia',
  Indonesia: 'Asia',
  China: 'Asia',
  Vietnam: 'Asia',
  'Sri Lanka': 'Asia',
  Slovenia: 'Europe',
  Bhutan: 'Asia',
  'South Africa': 'Africa',
  Singapore: 'Asia',
  Cambodia: 'Asia',
  Spain: 'Europe',
};

const countryOverrides: Record<string, string> = {
  'Wat Samphran Dragon Temple': 'Thailand',
  'Ryujin Shrine': 'Japan',
  'Longshan Temple': 'Taiwan',
  'Dragon Temple of Bali': 'Indonesia',
  'Lung Mo Temple': 'China',
  'Dragon Bridge Statue': 'Vietnam',
  'Golden Dragon of Dambulla': 'Sri Lanka',
  'Dragon of Wantilan': 'Indonesia',
  'Tian Tan Dragon Gate': 'China',
  'Dragon Monument of Ljubljana': 'Slovenia',
  'Dragon City of Bhutan': 'Bhutan',
  'Longcheng Ancient City': 'China',
  'Dragon Valley Kyoto': 'Japan',
  'Drakensberg Highlands': 'South Africa',
  'Dragon Harbor Singapore': 'Singapore',
};

function sanitizeText(input: string): string {
  return input
    .replace(/\bDragon Mother\b/g, 'Mother Spirit')
    .replace(/\bdragon god\b/gi, 'guardian deity')
    .replace(/\bbreathes fire and water\b/g, 'puts on illuminated water displays')
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/’/g, "'")
    .trim();
}

function lowercaseCategory(cat: string): RelicCategory {
  const c = cat.toLowerCase();
  if (c.startsWith('temple')) return 'temples';
  if (c.startsWith('statue')) return 'statues';
  return 'cities';
}

function buildRecords(): RelicRecord[] {
  const out: RelicRecord[] = [];
  let cursor = 0;
  (rawAtlas as any[]).forEach(group => {
    const category = lowercaseCategory(group.category);
    const palette = gradientByCategory[category];
    (group.items as any[]).forEach((it, idx) => {
      const country = countryOverrides[it.name] ?? 'Asia';
      const record: RelicRecord = {
        id: `${category}-${idx + 1}`,
        name: sanitizeText(it.name),
        category,
        country,
        region: regionByCountry[country] ?? 'World',
        coordinates: it.coordinates,
        loreText: sanitizeText(it.description),
        historyText: sanitizeText(it.history),
        timeline: (it.timeline as any[]).map(t => ({
          year: String(t.year),
          event: sanitizeText(String(t.event)),
        })),
        image: it.image,
        gradientKey: palette[(cursor + idx) % palette.length],
      };
      out.push(record);
    });
    cursor += 1;
  });
  return out;
}

export const relicAtlas: RelicRecord[] = buildRecords();

export const relicById = new Map(relicAtlas.map(r => [r.id, r]));

export function relicsByCategory(category: RelicCategory | 'all'): RelicRecord[] {
  if (category === 'all') return relicAtlas;
  return relicAtlas.filter(r => r.category === category);
}

export function pickRandomRelic(): RelicRecord {
  return relicAtlas[Math.floor(Math.random() * relicAtlas.length)];
}

export const relicCategories: { key: RelicCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'temples', label: 'Temples' },
  { key: 'statues', label: 'Statues' },
  { key: 'cities', label: 'Cities' },
];
