export type PortKey = 'explore' | 'vault' | 'atlas' | 'lore' | 'trial' | 'cipher';

export type PortDef = {
  key: PortKey;
  label: string;
  iconKey: 'pin' | 'bookmark' | 'map' | 'book' | 'star' | 'sword';
};

export const ports: PortDef[] = [
  { key: 'explore', label: 'Explore', iconKey: 'pin' },
  { key: 'vault', label: 'Vault', iconKey: 'bookmark' },
  { key: 'atlas', label: 'Atlas', iconKey: 'map' },
  { key: 'lore', label: 'Lore', iconKey: 'book' },
  { key: 'trial', label: 'Quiz', iconKey: 'star' },
  { key: 'cipher', label: 'Hunt', iconKey: 'sword' },
];
