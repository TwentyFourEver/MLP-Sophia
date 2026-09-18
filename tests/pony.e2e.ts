import { expect, test, type Page } from '@playwright/test';
import sharp from 'sharp';

async function openCreator(page: Page) {
  await page.addInitScript(() => localStorage.setItem('sophia-estrella-settings-v1', JSON.stringify({ muted: true, reducedMotion: true, textSpeed: 'instant' })));
  await page.goto('/');
  await page.getByRole('button', { name: /Nueva partida/ }).click();
  await expect(page.getByRole('heading', { name: 'Crea tu poni' })).toBeVisible();
}

async function savedPony(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('sophia-estrella-save-v1')!).pony);
}

test('custom pony follows the player through dialogue, chapters, manual/quick saves and reload', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await openCreator(page);
  await page.getByLabel('¿Cómo te llamas?').fill('Estrella');
  await page.getByRole('button', { name: 'Inspiración: Mariposa' }).click();
  await page.getByRole('button', { name: 'Ojos', exact: true }).click();
  await page.getByRole('button', { name: 'Ojos: Azul', exact: true }).click();
  await page.getByRole('button', { name: 'Pelo', exact: true }).click();
  await page.getByLabel('Color personalizado de pelo').fill('#cf79a6');
  await page.getByRole('button', { name: 'De lado', exact: true }).click();
  const expected = { name: 'Estrella', coat: '#fff2a8', eyes: '#497fce', mane: '#cf79a6', maneStyle: 'swept' };
  const avatar = page.locator('.creator-preview .pony-avatar');
  await expect(avatar).toHaveAttribute('data-coat', expected.coat);
  await expect(avatar).toHaveAttribute('data-eyes', expected.eyes);
  await expect(avatar).toHaveAttribute('data-mane', expected.mane);
  await expect(avatar).toHaveAttribute('data-hairstyle', expected.maneStyle);
  await page.screenshot({ path: 'test-results/pony-creator-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Comenzar aventura', exact: true }).click();
  await expect(page.locator('.scene-card')).toBeVisible();
  await page.locator('.scene-card').click();
  await expect(page.locator('.dialogue-panel')).toHaveAttribute('aria-label', 'Continuar');
  await page.locator('.dialogue-panel').click();
  await expect(page.locator('.dialogue-panel')).toContainText('¡Estrella!');
  expect(await savedPony(page)).toEqual(expected);
  await page.getByRole('button', { name: 'G. rápida', exact: true }).click();
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await page.getByRole('button', { name: /Partida 1/ }).click();
  await page.keyboard.press('Escape');
  await page.locator('.dialogue-panel').click();
  await page.getByRole('button', { name: 'C. rápida', exact: true }).click();
  await page.getByRole('button', { name: 'Cargar guardado rápido' }).click();
  await expect(page.locator('.dialogue-panel')).toContainText('¡Estrella!');
  expect(await savedPony(page)).toEqual(expected);
  // Cross a scene transition: the appearance must travel with the story cursor.
  for (let index = 0; index < 7; index++) {
    await expect(page.locator('.dialogue-panel')).toHaveAttribute('aria-label', 'Continuar');
    await page.locator('.dialogue-panel').click();
  }
  await expect(page.locator('.scene-card')).toContainText('El salón');
  expect(await savedPony(page)).toEqual(expected);
  await page.reload();
  await page.getByRole('button', { name: /^Continuar/ }).click();
  await expect(page.locator('.player-badge')).toContainText('Estrella');
  expect(await savedPony(page)).toEqual(expected);
  await page.getByRole('button', { name: 'Pausar juego' }).click();
  await expect(page.locator('.pause-pony .pony-avatar')).toHaveAttribute('data-mane', expected.mane);
  await page.getByRole('button', { name: 'Volver al menú principal' }).click();
  await page.getByRole('button', { name: /Nueva partida/ }).click();
  await page.getByRole('button', { name: 'Crear mi poni' }).click();
  await page.getByLabel('¿Cómo te llamas?').fill('Otro poni');
  await page.getByRole('button', { name: 'Inspiración: Cielo' }).click();
  await page.getByRole('button', { name: 'Volver al menú', exact: true }).click();
  expect(await savedPony(page)).toEqual(expected);
  await page.getByRole('button', { name: /Nueva partida/ }).click();
  await page.getByRole('button', { name: 'Crear mi poni' }).click();
  await page.getByRole('button', { name: 'Comenzar aventura', exact: true }).click();
  await expect(page.locator('.scene-card')).toBeVisible();
  await page.getByRole('button', { name: 'Cargar', exact: true }).click();
  await page.getByRole('button', { name: /Partida 1/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cargar partida', exact: true }).click();
  await expect(page.locator('.dialogue-panel')).toContainText('¡Estrella!');
  expect(await savedPony(page)).toEqual(expected);
  await page.getByRole('button', { name: 'Historial', exact: true }).click();
  await expect(page.locator('.history-list')).toContainText('¡Estrella!');
  expect(errors).toEqual([]);
});

test('blank names cannot start a game; cancellation preserves an empty save', async ({ page }) => {
  await openCreator(page);
  await page.getByLabel('¿Cómo te llamas?').fill('   ');
  await expect(page.getByRole('button', { name: 'Comenzar aventura', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Restablecer diseño' }).click();
  await expect(page.getByLabel('¿Cómo te llamas?')).toHaveValue('Sophia');
  await page.getByRole('button', { name: 'Volver al menú', exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem('sophia-estrella-save-v1'))).toBeNull();
});

test('rendered colors are independent and eye highlights stay white', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openCreator(page);
  const avatar = page.locator('.creator-preview .pony-avatar');
  const sample = async () => {
    const { data, info } = await sharp(await avatar.screenshot()).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    const scale = Math.min(info.width / 1070, info.height / 1585);
    const at = (x: number, y: number) => {
      const px = Math.round((info.width - 1070 * scale) / 2 + x * scale);
      const py = Math.round((info.height - 1585 * scale) / 2 + (y + 25) * scale);
      const offset = (py * info.width + px) * info.channels;
      return [...data.subarray(offset, offset + 3)];
    };
    return { coat: at(400, 360), eyes: at(198, 437), mane: at(350, 155), white: at(170, 430), pupil: at(260, 455) };
  };
  const difference = (a: number[], b: number[]) => Math.max(...a.map((channel, index) => Math.abs(channel - b[index])));
  const original = await sample();
  await page.getByRole('button', { name: 'Piel: Menta', exact: true }).click();
  const coat = await sample();
  expect(difference(original.coat, coat.coat)).toBeGreaterThan(25);
  expect(difference(original.eyes, coat.eyes)).toBeLessThan(3);
  expect(difference(original.mane, coat.mane)).toBeLessThan(3);
  await page.getByRole('button', { name: 'Ojos', exact: true }).click();
  await page.getByRole('button', { name: 'Ojos: Ámbar', exact: true }).click();
  const eyes = await sample();
  expect(difference(coat.eyes, eyes.eyes)).toBeGreaterThan(25);
  expect(difference(coat.coat, eyes.coat)).toBeLessThan(3);
  expect(difference(coat.mane, eyes.mane)).toBeLessThan(3);
  expect(Math.min(...eyes.white)).toBeGreaterThan(240);
  expect(Math.max(...eyes.pupil)).toBeLessThan(25);
  await page.getByRole('button', { name: 'Pelo', exact: true }).click();
  await page.getByRole('button', { name: 'Pelo: Miel', exact: true }).click();
  const mane = await sample();
  expect(difference(eyes.mane, mane.mane)).toBeGreaterThan(25);
  expect(difference(eyes.coat, mane.coat)).toBeLessThan(3);
  expect(difference(eyes.eyes, mane.eyes)).toBeLessThan(3);
});

test('all hairstyle choices render a distinct mane and remain selectable', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await openCreator(page);
  const avatar = page.locator('.creator-preview .pony-avatar');
  const choices = [
    ['Ondulado', 'flowing'], ['De lado', 'swept'], ['Corto', 'short'], ['Rizos', 'curly'],
    ['Trenza', 'braided'], ['Cresta', 'mohawk'], ['Bob', 'bob'],
    ['Lacio largo', 'straight'], ['Coleta alta', 'ponytail'], ['Dos coletas', 'pigtails'],
    ['Moño', 'bun'], ['Pixie', 'pixie'], ['En capas', 'layered'],
    ['Moños dobles', 'spacebuns'], ['Afro', 'afro'], ['Copete retro', 'pompadour'],
    ['Espirales', 'spiral'], ['Abanico', 'fan'], ['Estelar', 'star'],
  ] as const;
  const screenshots = new Set<string>();
  await expect(page.locator('.creator-hairstyles button')).toHaveCount(choices.length);
  const hairstyleList = page.getByLabel('Tipos de peinado');
  await hairstyleList.scrollIntoViewIfNeeded();
  const pageScrollBefore = await page.locator('.pony-creator').evaluate((element) => element.scrollTop);
  await hairstyleList.hover();
  await page.mouse.wheel(0, 500);
  expect(await hairstyleList.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect(await page.locator('.pony-creator').evaluate((element) => element.scrollTop)).toBe(pageScrollBefore);
  await hairstyleList.evaluate((element) => { element.scrollTop = 0; });
  for (const [label, id] of choices) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page.getByRole('button', { name: label, exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(avatar).toHaveAttribute('data-hairstyle', id);
    screenshots.add((await avatar.screenshot({ path: `test-results/hairstyle-${id}.png` })).toString('base64'));
  }
  expect(screenshots.size).toBe(choices.length);
  await page.screenshot({ path: 'test-results/pony-hairstyles.png', fullPage: true });
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 1366, height: 768 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }]) {
  test(`creator has reachable controls and no horizontal clipping at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await openCreator(page);
    await expect(page.locator('.creator-preview .pony-avatar')).toBeVisible();
    expect(await page.locator('.pony-creator').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    if (viewport.width >= 1000) {
      const panel = await page.locator('.creator-panel').boundingBox();
      expect(panel).not.toBeNull();
      expect(panel!.y + panel!.height).toBeLessThanOrEqual(viewport.height - (viewport.height <= 820 ? 45 : 8));
      if (viewport.height <= 820) expect(panel!.height).toBeLessThanOrEqual(555);
    }
    await page.getByRole('button', { name: 'Inspiración: Mariposa' }).click();
    await page.getByRole('button', { name: 'Estelar', exact: true }).click();
    await expect(page.locator('.creator-preview .pony-avatar')).toHaveAttribute('data-hairstyle', 'star');
    await page.screenshot({ path: `test-results/pony-controls-${viewport.width}.png` });
    await page.getByRole('button', { name: 'Comenzar aventura', exact: true }).click();
    await expect(page.locator('.scene-card')).toBeVisible();
    await expect(page.locator('.player-badge')).toContainText('Sophia');
  });
}
