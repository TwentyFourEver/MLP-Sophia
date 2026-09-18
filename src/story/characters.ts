import type { CharacterDefinition, CharacterId, EmotionId, SceneId } from './types';

export const characters: Record<Exclude<CharacterId, 'narrator'>, CharacterDefinition> = {
  twilight: {
    id: 'twilight',
    name: 'Twilight Sparkle',
    accent: '#a987ff',
    portraits: {
      neutral: '/assets/characters/Twilight Sparkle/Twilight Sparkle.png',
      happy: '/assets/characters/Twilight Sparkle/Twilight Sparkle-happy.png',
      sad: '/assets/characters/Twilight Sparkle/Twilight Sparkle-sad.png',
      doubtful: '/assets/characters/Twilight Sparkle/Twilight Sparkle-doubtful.png',
    },
  },
  spike: {
    id: 'spike',
    name: 'Spike',
    accent: '#9be15d',
    portraits: {
      neutral: '/assets/characters/Spike/Spike.png',
      happy: '/assets/characters/Spike/doubtful-happy.png',
      sad: '/assets/characters/Spike/Spike-sad.png',
      doubtful: '/assets/characters/Spike/Spike-doubtful.png',
    },
    portraitClass: 'portrait--spike',
  },
  pinkie: {
    id: 'pinkie',
    name: 'Pinkie Pie',
    accent: '#ff80c8',
    portraits: {
      neutral: '/assets/characters/Pinkie Pie/Pinkie Pie.png',
      happy: '/assets/characters/Pinkie Pie/Pinkie Pie-happy.png',
      sad: '/assets/characters/Pinkie Pie/Pinkie Pie-sad.png',
      doubtful: '/assets/characters/Pinkie Pie/Pinkie Pie-doubtful.png',
    },
  },
  applejack: {
    id: 'applejack',
    name: 'Applejack',
    accent: '#ffb454',
    portraits: {
      neutral: '/assets/characters/Applejack/Applejack.png',
      happy: '/assets/characters/Applejack/Applejack-happy.png',
      sad: '/assets/characters/Applejack/Applejack-sad.png',
      doubtful: '/assets/characters/Applejack/Applejack-doubtful.png',
    },
  },
  rarity: {
    id: 'rarity',
    name: 'Rarity',
    accent: '#bc9cff',
    portraits: {
      neutral: '/assets/characters/Rarity/Rarity.png',
      happy: '/assets/characters/Rarity/Rarity-happy.png',
      sad: '/assets/characters/Rarity/Rarity-sad.png',
      doubtful: '/assets/characters/Rarity/Rarity-doubtful.png',
    },
  },
  fluttershy: {
    id: 'fluttershy',
    name: 'Fluttershy',
    accent: '#ffd872',
    portraits: {
      neutral: '/assets/characters/Fluttershy/Fluttershy.png',
      happy: '/assets/characters/Fluttershy/Fluttershy-happy.png',
      sad: '/assets/characters/Fluttershy/Fluttershy-sad.png',
      doubtful: '/assets/characters/Fluttershy/Fluttershy-doubtful.png',
    },
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow Dash',
    accent: '#64dcff',
    portraits: {
      neutral: '/assets/characters/Rainbow Dash/Rainbow Dash.png',
      happy: '/assets/characters/Rainbow Dash/Rainbow Dash-happy.png',
      sad: '/assets/characters/Rainbow Dash/Rainbow Dash-sad.png',
      doubtful: '/assets/characters/Rainbow Dash/Rainbow Dash-doubtful.png',
    },
  },
};

export const backgrounds: Record<SceneId, string> = {
  ponyville: '/assets/backgrounds/ponyville-gate.png',
  hall: '/assets/backgrounds/crystal-hall.png',
  festival: '/assets/backgrounds/festival-plaza.png',
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
