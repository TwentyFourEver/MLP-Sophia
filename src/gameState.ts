import { backgrounds } from './story/characters';
import { story } from './story/story';
import type { SceneId } from './story/types';
import { parsePony, type PonyAppearance } from './pony';

export type TextSpeedId = 'slow' | 'normal' | 'fast' | 'instant';
export interface HistoryEntry { nodeId: string; choice?: string }
export interface SavedGame {
  nodeId: string;
  background: SceneId;
  history: HistoryEntry[];
  pony: PonyAppearance;
  savedAt?: number;
}
export interface GameSettings {
  muted: boolean;
  musicVolume: number;
  effectsVolume: number;
  textSpeed: TextSpeedId;
  autoDelay: number;
  textSize: number;
  panelOpacity: number;
  cursorEffects: boolean;
  reducedMotion: boolean;
  followSystemMotion: boolean;
  textSound: boolean;
}
export const SAVE_KEY = 'sophia-estrella-save-v1';
export const SETTINGS_KEY = 'sophia-estrella-settings-v1';
export const SLOTS_KEY = 'sophia-estrella-slots-v1';
export const READ_KEY = 'sophia-estrella-read-v1';
export const TEXT_SPEED_DELAYS: Record<TextSpeedId, number> = { slow: 34, normal: 20, fast: 10, instant: 0 };
export const defaultSettings: GameSettings = {
  muted: false, musicVolume: 0.7, effectsVolume: 0.8, textSpeed: 'normal',
  autoDelay: 3, textSize: 100, panelOpacity: 92, cursorEffects: true,
  reducedMotion: false, followSystemMotion: false, textSound: true,
};
export function readStorage(key: string): unknown {
  try { return JSON.parse(window.localStorage.getItem(key) ?? 'null'); } catch { return null; }
}
export function writeStorage(key: string, value: unknown): boolean {
  try { window.localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}
function bounded(value: unknown, fallback: number, min: number, max: number) {
  return typeof value === 'number' && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;
}
export function parseSave(value: unknown): SavedGame | null {
  if (!value || typeof value !== 'object') return null;
  const save = value as Partial<SavedGame>;
  if (typeof save.nodeId !== 'string' || !Object.hasOwn(story, save.nodeId)) return null;
  if (typeof save.background !== 'string' || !Object.hasOwn(backgrounds, save.background)) return null;
  return {
    nodeId: save.nodeId, background: story[save.nodeId].background ?? save.background,
    pony: parsePony(save.pony),
    savedAt: typeof save.savedAt === 'number' && Number.isFinite(save.savedAt) ? save.savedAt : undefined,
    history: Array.isArray(save.history) ? save.history.filter((entry) => {
      if (!entry || typeof entry.nodeId !== 'string' || !Object.hasOwn(story, entry.nodeId)) return false;
      const node = story[entry.nodeId];
      return node.type === 'dialogue' || (node.type === 'choice' && node.choices.some((choice) => choice.label === entry.choice));
    }).slice(-150) : [],
  };
}
export function readSettings(): GameSettings {
  const raw = readStorage(SETTINGS_KEY);
  const settings = (raw && typeof raw === 'object' ? raw : {}) as Partial<GameSettings>;
  return {
    ...defaultSettings,
    muted: typeof settings.muted === 'boolean' ? settings.muted : false,
    musicVolume: bounded(settings.musicVolume, 0.7, 0, 1),
    effectsVolume: bounded(settings.effectsVolume, 0.8, 0, 1),
    textSpeed: ['slow', 'normal', 'fast', 'instant'].includes(settings.textSpeed ?? '') ? settings.textSpeed! : 'normal',
    autoDelay: bounded(settings.autoDelay, 3, 1, 8),
    textSize: bounded(settings.textSize, 100, 85, 125),
    panelOpacity: bounded(settings.panelOpacity, 92, 45, 100),
    cursorEffects: typeof settings.cursorEffects === 'boolean' ? settings.cursorEffects : true,
    reducedMotion: typeof settings.reducedMotion === 'boolean' ? settings.reducedMotion : false,
    followSystemMotion: typeof settings.followSystemMotion === 'boolean' ? settings.followSystemMotion : false,
    textSound: typeof settings.textSound === 'boolean' ? settings.textSound : true,
  };
}
export function readSlots(): (SavedGame | null)[] {
  const value = readStorage(SLOTS_KEY);
  return Array.from({ length: 4 }, (_, index) => parseSave(Array.isArray(value) ? value[index] : null));
}
export function readSeen(): Set<string> {
  const value = readStorage(READ_KEY);
  return new Set(Array.isArray(value) ? value.filter((id) => typeof id === 'string' && Object.hasOwn(story, id)) : []);
}
export const sceneNames: Record<SceneId, string> = {
  ponyville: 'Una tarde en Ponyville', hall: 'El salón de los preparativos', festival: 'La luz de la amistad',
};

export function canSkip(nodeId: string, seen: Set<string>) {
  return story[nodeId]?.type === 'dialogue' && seen.has(nodeId);
}
