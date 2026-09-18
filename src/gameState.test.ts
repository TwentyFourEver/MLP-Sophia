import { describe, expect, it } from 'vitest';
import { canSkip, parseSave } from './gameState';

describe('persistencia y salto de lectura', () => {
  it('migra el autoguardado original conservando el punto de la historia', () => {
    expect(parseSave({ nodeId: 'twilight-welcome', background: 'ponyville' })).toMatchObject({ nodeId: 'twilight-welcome', history: [] });
  });
  it('rechaza partidas corruptas y claves heredadas del prototipo', () => {
    for (const value of [null, [], 'x', { nodeId: 'missing', background: 'hall' }, { nodeId: 'constructor', background: 'ponyville' }, { nodeId: 'twilight-welcome', background: 'toString' }]) expect(parseSave(value)).toBeNull();
  });
  it('restaura el fondo de los capítulos y filtra el historial inválido', () => {
    expect(parseSave({ nodeId: 'hall-scene', background: 'ponyville', history: [null, { nodeId: 'missing' }, { nodeId: 'twilight-welcome' }] })).toMatchObject({ background: 'hall', history: [{ nodeId: 'twilight-welcome' }] });
  });
  it('solo permite saltar diálogos leídos; nunca escenas ni decisiones', () => {
    const seen = new Set(['twilight-welcome', 'arrival-scene', 'pinkie-choice']);
    expect(canSkip('twilight-welcome', seen)).toBe(true);
    expect(canSkip('spike-list', seen)).toBe(false);
    expect(canSkip('arrival-scene', seen)).toBe(false);
    expect(canSkip('pinkie-choice', seen)).toBe(false);
  });
});
