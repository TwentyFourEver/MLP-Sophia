import type { StoryNode } from './story/types';
import { assetPath } from './assets';

export type ManeStyle = 'flowing' | 'swept' | 'short' | 'curly' | 'braided' | 'mohawk' | 'bob'
  | 'straight' | 'ponytail' | 'pigtails' | 'bun' | 'pixie' | 'layered'
  | 'spacebuns' | 'afro' | 'pompadour' | 'spiral' | 'fan' | 'star';
export interface PonyAppearance {
  name: string;
  coat: string;
  eyes: string;
  mane: string;
  maneStyle: ManeStyle;
}

export const PONY_BASE = assetPath('player/pony-base.webp');
export const DEFAULT_PONY: PonyAppearance = {
  name: 'Sophia', coat: '#d6b4ed', eyes: '#7955b5', mane: '#61519c', maneStyle: 'flowing',
};
export const MANE_STYLES: { id: ManeStyle; label: string }[] = [
  { id: 'flowing', label: 'Ondulado' }, { id: 'swept', label: 'De lado' },
  { id: 'short', label: 'Corto' }, { id: 'curly', label: 'Rizos' },
  { id: 'braided', label: 'Trenza' }, { id: 'mohawk', label: 'Cresta' },
  { id: 'bob', label: 'Bob' },
  { id: 'straight', label: 'Lacio largo' }, { id: 'ponytail', label: 'Coleta alta' },
  { id: 'pigtails', label: 'Dos coletas' }, { id: 'bun', label: 'Moño' },
  { id: 'pixie', label: 'Pixie' }, { id: 'layered', label: 'En capas' },
  { id: 'spacebuns', label: 'Moños dobles' }, { id: 'afro', label: 'Afro' },
  { id: 'pompadour', label: 'Copete retro' }, { id: 'spiral', label: 'Espirales' },
  { id: 'fan', label: 'Abanico' }, { id: 'star', label: 'Estelar' },
];
export const PONY_PRESETS = [
  { label: 'Lavanda', coat: '#d6b4ed', eyes: '#7955b5', mane: '#61519c', maneStyle: 'flowing' },
  { label: 'Mariposa', coat: '#fff2a8', eyes: '#159b9b', mane: '#f2a5c9', maneStyle: 'flowing' },
  { label: 'Cielo', coat: '#a7dfef', eyes: '#aa5687', mane: '#446caa', maneStyle: 'swept' },
  { label: 'Durazno', coat: '#f5c59f', eyes: '#589e7b', mane: '#b66777', maneStyle: 'short' },
] satisfies (Omit<PonyAppearance, 'name'> & { label: string })[];

export function parsePony(value: unknown): PonyAppearance {
  const raw = value && typeof value === 'object' ? value as Partial<PonyAppearance> : {};
  const color = (key: 'coat' | 'eyes' | 'mane') => typeof raw[key] === 'string' && /^#[0-9a-f]{6}$/i.test(raw[key]) ? raw[key].toLowerCase() : DEFAULT_PONY[key];
  return {
    name: typeof raw.name === 'string' ? raw.name.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, 24) || DEFAULT_PONY.name : DEFAULT_PONY.name,
    coat: color('coat'), eyes: color('eyes'), mane: color('mane'),
    maneStyle: MANE_STYLES.some(({ id }) => id === raw.maneStyle) ? raw.maneStyle! : DEFAULT_PONY.maneStyle,
  };
}

export function ponyText(text: string, name: string) {
  return text.replace(/\bSophia\b/g, () => name);
}

// Keep the script and choice labels intact so existing routes and saves remain valid.
export function personalizeNode(node: StoryNode, name: string): StoryNode {
  if (node.type === 'dialogue') return { ...node, text: ponyText(node.text, name) };
  if (node.type === 'choice') return { ...node, prompt: ponyText(node.prompt, name) };
  if (node.type === 'ending') return { ...node, title: ponyText(node.title, name), text: ponyText(node.text, name) };
  return { ...node, title: ponyText(node.title, name), subtitle: ponyText(node.subtitle, name) };
}
