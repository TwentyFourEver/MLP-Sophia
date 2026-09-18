import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { backgrounds, characters } from './characters';
import { INITIAL_NODE_ID, story, validateStory } from './story';
import type { StoryNode } from './types';

function play(choiceIndexes: number[]) {
  const visited: string[] = [];
  let currentId = INITIAL_NODE_ID;
  let choiceIndex = 0;

  while (visited.length < 300) {
    visited.push(currentId);
    const node: StoryNode = story[currentId];
    if (node.type === 'ending') return visited;
    if (node.type === 'choice') {
      const selection = node.choices[choiceIndexes[choiceIndex] ?? 0];
      choiceIndex += 1;
      currentId = selection.next;
    } else {
      currentId = node.next;
    }
  }

  throw new Error('La historia no llegó al final en 300 pasos.');
}

describe('historia de Sophia', () => {
  it('no contiene referencias rotas ni nodos inalcanzables', () => {
    expect(validateStory()).toEqual([]);
  });

  it('contiene nueve decisiones de dos opciones a lo largo de la aventura', () => {
    const choices = Object.values(story).filter((node) => node.type === 'choice');
    expect(choices).toHaveLength(9);
    choices.forEach((node) => {
      if (node.type === 'choice') expect(node.choices).toHaveLength(2);
    });
  });

  it('las rutas representativas convergen en el mismo final', () => {
    for (const picks of [[0, 0, 0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1, 1, 1], [0, 1, 0, 1, 0, 1, 0, 1, 0]]) {
      const path = play(picks);
      expect(path.at(-1)).toBe('ending');
      expect(path.filter((id) => story[id].type === 'choice')).toHaveLength(9);
    }
  });

  it('las respuestas alternativas usan expresiones acordes a cada momento', () => {
    expect(story['pinkie-quiet-reaction']).toMatchObject({ speaker: 'pinkie', emotion: 'doubtful' });
    expect(story['applejack-choice-reaction']).toMatchObject({ speaker: 'applejack', emotion: 'happy' });
    expect(story['rarity-choice-reaction']).toMatchObject({ speaker: 'rarity', emotion: 'happy' });
    expect(story['rainbow-choice-reaction']).toMatchObject({ speaker: 'rainbow', emotion: 'happy' });
    expect(story['fluttershy-worry']).toMatchObject({ speaker: 'fluttershy', emotion: 'sad' });
    expect(story['twilight-final-worry']).toMatchObject({ speaker: 'twilight', emotion: 'doubtful' });
  });

  it('cada personaje tiene las cuatro expresiones nuevas', () => {
    Object.values(characters).forEach((character) => {
      expect(Object.keys(character.portraits).sort()).toEqual(['doubtful', 'happy', 'neutral', 'sad']);
    });
  });

  it('reserva movimientos especiales para los momentos más expresivos', () => {
    expect(story['pinkie-entrance']).toMatchObject({ motion: 'celebrate' });
    expect(story['pinkie-quiet-reaction']).toMatchObject({ motion: 'soft' });
    expect(story['applejack-debate']).toMatchObject({ motion: 'swagger' });
    expect(story['rarity-debate']).toMatchObject({ motion: 'spin' });
    expect(story['fluttershy-worry']).toMatchObject({ motion: 'peek' });
    expect(story['rainbow-counter']).toMatchObject({ motion: 'dash' });
    expect(story['spike-star']).toMatchObject({ motion: 'shake' });
    expect(story['spike-realization']).toMatchObject({ motion: 'celebrate' });
  });

  it('todos los fondos y retratos referenciados existen localmente', () => {
    const urls = [
      ...Object.values(backgrounds),
      ...Object.values(characters).flatMap((character) => Object.values(character.portraits)),
    ];

    urls.forEach((url) => {
      expect(existsSync(path.resolve('public', url.replace(/^\//, ''))), url).toBe(true);
    });
  });
});
