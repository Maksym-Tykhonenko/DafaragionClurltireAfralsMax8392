// Lightweight session keep-store. Best-effort persistence:
// reads attempt the optional AsyncStorage module via a soft require so the
// app still runs without it installed. All writes are mirrored to an
// in-memory cache for instant reads.

type AnyDict = Record<string, unknown>;

let softStore: { getItem(k: string): Promise<string | null>; setItem(k: string, v: string): Promise<void> } | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('@react-native-async-storage/async-storage');
  softStore = mod?.default ?? mod ?? null;
} catch (_e) {
  softStore = null;
}

const cache: AnyDict = {};

const NAMESPACE = 'wyrm.atlas.v1.';

const k = (key: string) => NAMESPACE + key;

export const keepKeys = {
  welcomeDone: 'welcome.done',
  savedRelicIds: 'saved.relic.ids',
  recentRelicIds: 'recent.relic.ids',
  loreSavedIds: 'lore.saved.ids',
  trialBestPct: 'trial.best.pct',
  cipherBestScore: 'cipher.best.score',
};

export async function readValue<T>(key: string, fallback: T): Promise<T> {
  if (key in cache) return cache[key] as T;
  if (softStore) {
    try {
      const raw = await softStore.getItem(k(key));
      if (raw != null) {
        const parsed = JSON.parse(raw);
        cache[key] = parsed;
        return parsed as T;
      }
    } catch (_e) {
      // ignore; fallback
    }
  }
  cache[key] = fallback;
  return fallback;
}

export async function writeValue<T>(key: string, value: T): Promise<void> {
  cache[key] = value;
  if (softStore) {
    try {
      await softStore.setItem(k(key), JSON.stringify(value));
    } catch (_e) {
      // ignore: cache still holds the value for the session
    }
  }
}

export async function toggleInList(key: string, id: string | number, max?: number): Promise<(string | number)[]> {
  const list = await readValue<(string | number)[]>(key, []);
  const next = list.includes(id) ? list.filter(x => x !== id) : [id, ...list];
  const trimmed = typeof max === 'number' ? next.slice(0, max) : next;
  await writeValue(key, trimmed);
  return trimmed;
}

export async function pushUnique(key: string, id: string | number, max = 12): Promise<(string | number)[]> {
  const list = await readValue<(string | number)[]>(key, []);
  const without = list.filter(x => x !== id);
  const next = [id, ...without].slice(0, max);
  await writeValue(key, next);
  return next;
}
