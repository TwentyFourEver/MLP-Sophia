import type { CharacterDefinition, CharacterId, EmotionId, SceneId } from './types';
import { assetPath } from '../assets';

export const characters: Record<Exclude<CharacterId, 'narrator'>, CharacterDefinition> = {
  twilight: {
    id: 'twilight',
    name: 'Twilight Sparkle',
    accent: '#a987ff',
    portraits: {
      neutral: assetPath('characters/Twilight Sparkle/Twilight Sparkle.png'),
      happy: assetPath('characters/Twilight Sparkle/Twilight Sparkle-happy.png'),
      sad: assetPath('characters/Twilight Sparkle/Twilight Sparkle-sad.png'),
      doubtful: assetPath('characters/Twilight Sparkle/Twilight Sparkle-doubtful.png'),
    },
  },
  spike: {
    id: 'spike',
    name: 'Spike',
    accent: '#9be15d',
    portraits: {
      neutral: assetPath('characters/Spike/Spike.png'),
      happy: assetPath('characters/Spike/doubtful-happy.png'),
      sad: assetPath('characters/Spike/Spike-sad.png'),
      doubtful: assetPath('characters/Spike/Spike-doubtful.png'),
    },
    portraitClass: 'portrait--spike',
  },
  pinkie: {
    id: 'pinkie',
    name: 'Pinkie Pie',
    accent: '#ff80c8',
    portraits: {
      neutral: assetPath('characters/Pinkie Pie/Pinkie Pie.png'),
      happy: assetPath('characters/Pinkie Pie/Pinkie Pie-happy.png'),
      sad: assetPath('characters/Pinkie Pie/Pinkie Pie-sad.png'),
      doubtful: assetPath('characters/Pinkie Pie/Pinkie Pie-doubtful.png'),
    },
  },
  applejack: {
    id: 'applejack',
    name: 'Applejack',
    accent: '#ffb454',
    portraits: {
      neutral: assetPath('characters/Applejack/Applejack.png'),
      happy: assetPath('characters/Applejack/Applejack-happy.png'),
      sad: assetPath('characters/Applejack/Applejack-sad.png'),
      doubtful: assetPath('characters/Applejack/Applejack-doubtful.png'),
    },
  },
  rarity: {
    id: 'rarity',
    name: 'Rarity',
    accent: '#bc9cff',
    portraits: {
      neutral: assetPath('characters/Rarity/Rarity.png'),
      happy: assetPath('characters/Rarity/Rarity-happy.png'),
      sad: assetPath('characters/Rarity/Rarity-sad.png'),
      doubtful: assetPath('characters/Rarity/Rarity-doubtful.png'),
    },
  },
  fluttershy: {
    id: 'fluttershy',
    name: 'Fluttershy',
    accent: '#ffd872',
    portraits: {
      neutral: assetPath('characters/Fluttershy/Fluttershy.png'),
      happy: assetPath('characters/Fluttershy/Fluttershy-happy.png'),
      sad: assetPath('characters/Fluttershy/Fluttershy-sad.png'),
      doubtful: assetPath('characters/Fluttershy/Fluttershy-doubtful.png'),
    },
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow Dash',
    accent: '#64dcff',
    portraits: {
      neutral: assetPath('characters/Rainbow Dash/Rainbow Dash.png'),
      happy: assetPath('characters/Rainbow Dash/Rainbow Dash-happy.png'),
      sad: assetPath('characters/Rainbow Dash/Rainbow Dash-sad.png'),
      doubtful: assetPath('characters/Rainbow Dash/Rainbow Dash-doubtful.png'),
    },
  },
};

export const backgrounds: Record<SceneId, string> = {
  ponyville: assetPath('backgrounds/ponyville-gate.png'),
  hall: assetPath('backgrounds/crystal-hall.png'),
  festival: assetPath('backgrounds/festival-plaza.png'),
};

export function getPortrait(characterId: CharacterId, emotion: EmotionId = 'neutral') {
  if (characterId === 'narrator') return null;
  const character = characters[characterId];
  return character.portraits[emotion] ?? character.portraits.neutral;
}

export const preloadableAssets = [
  ...Object.values(backgrounds),
  ...Object.values(characters).flatMap((character) => Object.values(character.portraits)),
];
