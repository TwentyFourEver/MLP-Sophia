import { describe, expect, it } from 'vitest';
import { parseSave } from './gameState';
import { DEFAULT_PONY, MANE_STYLES, parsePony, personalizeNode, ponyText } from './pony';
import { story } from './story/story';

describe('poni personalizado', () => {
  it('mantiene las partidas anteriores y recupera una apariencia dañada sin perder progreso', () => {
    for (const pony of [undefined, null, [], 'invalid', { name: '   ', coat: 'red', eyes: '#123', mane: 'url(x)', maneStyle: 'constructor' }]) {
      const save = parseSave({ nodeId: 'twilight-welcome', background: 'ponyville', pony });
      expect(save?.nodeId).toBe('twilight-welcome');
      expect(save?.pony).toEqual(DEFAULT_PONY);
    }
  });

  it('conserva los colores exactos y el peinado al serializar y cargar', () => {
    const pony = { name: '  Estrella  ', coat: '#ABCDEF', eyes: '#123456', mane: '#000000', maneStyle: 'short' };
    expect(parseSave(JSON.parse(JSON.stringify({ nodeId: 'hall-scene', background: 'hall', pony })))?.pony)
      .toEqual({ ...pony, name: 'Estrella', coat: '#abcdef' });
    expect(parsePony({ name: 'a'.repeat(50) }).name).toHaveLength(24);
  });

  it('acepta y conserva todos los tipos de peinado disponibles', () => {
    expect(MANE_STYLES.length).toBeGreaterThanOrEqual(17);
    expect(new Set(MANE_STYLES.map(({ id }) => id)).size).toBe(MANE_STYLES.length);
    for (const { id } of MANE_STYLES) {
      expect(parsePony({ maneStyle: id }).maneStyle).toBe(id);
      expect(parseSave(JSON.parse(JSON.stringify({ nodeId: 'hall-scene', background: 'hall', pony: { ...DEFAULT_PONY, maneStyle: id } })))?.pony.maneStyle).toBe(id);
    }
  });

  it('personaliza el guion sin modificarlo ni interpretar caracteres de reemplazo', () => {
    const original = story['twilight-welcome'];
    const personalized = personalizeNode(original, 'Luna $&');
    expect(personalized.type === 'dialogue' && personalized.text).toContain('¡Luna $&!');
    expect(original.type === 'dialogue' && original.text).toContain('¡Sophia!');
    expect(ponyText('Sophia y Sophia', '$&')).toBe('$& y $&');
    const choice = Object.values(story).find((node) => node.type === 'choice')!;
    const personalizedChoice = personalizeNode(choice, 'Luna');
    if (choice.type === 'choice' && personalizedChoice.type === 'choice') expect(personalizedChoice.choices).toBe(choice.choices);
  });
});
