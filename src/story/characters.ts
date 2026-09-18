import type { CharacterDefinition, CharacterId, EmotionId, SceneId } from './types';
import { assetPath } from '../assets';

export const characters: Record<Exclude<CharacterId, 'narrator'>, CharacterDefinition> = {
  twilight: {
    id: 'twilight',
    name: 'Twilight Sparkle',
    accent: '#a987ff',
    portraits: {
      neutral: assetPath('characters/twilight-sparkle/twilight-sparkle.webp'),
      happy: assetPath('characters/twilight-sparkle/twilight-sparkle-happy.webp'),
      sad: assetPath('characters/twilight-sparkle/twilight-sparkle-sad.webp'),
      doubtful: assetPath('characters/twilight-sparkle/twilight-sparkle-doubtful.webp'),
    },
  },
  spike: {
    id: 'spike',
    name: 'Spike',
    accent: '#9be15d',
    portraits: {
      neutral: assetPath('characters/spike/spike.webp'),
      happy: assetPath('characters/spike/spike-happy.webp'),
      sad: assetPath('characters/spike/spike-sad.webp'),
      doubtful: assetPath('characters/spike/spike-doubtful.webp'),
    },
    portraitClass: 'portrait--spike',
  },
  pinkie: {
    id: 'pinkie',
    name: 'Pinkie Pie',
    accent: '#ff80c8',
    portraits: {
      neutral: assetPath('characters/pinkie-pie/pinkie-pie.webp'),
      happy: assetPath('characters/pinkie-pie/pinkie-pie-happy.webp'),
      sad: assetPath('characters/pinkie-pie/pinkie-pie-sad.webp'),
      doubtful: assetPath('characters/pinkie-pie/pinkie-pie-doubtful.webp'),
    },
  },
  applejack: {
    id: 'applejack',
    name: 'Applejack',
    accent: '#ffb454',
    portraits: {
      neutral: assetPath('characters/applejack/applejack.webp'),
      happy: assetPath('characters/applejack/applejack-happy.webp'),
      sad: assetPath('characters/applejack/applejack-sad.webp'),
      doubtful: assetPath('characters/applejack/applejack-doubtful.webp'),
    },
  },
  rarity: {
    id: 'rarity',
    name: 'Rarity',
    accent: '#bc9cff',
    portraits: {
      neutral: assetPath('characters/rarity/rarity.webp'),
      happy: assetPath('characters/rarity/rarity-happy.webp'),
      sad: assetPath('characters/rarity/rarity-sad.webp'),
      doubtful: assetPath('characters/rarity/rarity-doubtful.webp'),
    },
  },
  fluttershy: {
    id: 'fluttershy',
    name: 'Fluttershy',
    accent: '#ffd872',
    portraits: {
      neutral: assetPath('characters/fluttershy/fluttershy.webp'),
      happy: assetPath('characters/fluttershy/fluttershy-happy.webp'),
      sad: assetPath('characters/fluttershy/fluttershy-sad.webp'),
      doubtful: assetPath('characters/fluttershy/fluttershy-doubtful.webp'),
    },
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow Dash',
    accent: '#64dcff',
    portraits: {
      neutral: assetPath('characters/rainbow-dash/rainbow-dash.webp'),
      happy: assetPath('characters/rainbow-dash/rainbow-dash-happy.webp'),
      sad: assetPath('characters/rainbow-dash/rainbow-dash-sad.webp'),
      doubtful: assetPath('characters/rainbow-dash/rainbow-dash-doubtful.webp'),
    },
  },
};

export const backgrounds: Record<SceneId, string> = {
  ponyville: assetPath('backgrounds/ponyville-gate.webp'),
  hall: assetPath('backgrounds/crystal-hall.webp'),
  festival: assetPath('backgrounds/festival-plaza.webp'),
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
