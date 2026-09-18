import { expect, test, type Page } from '@playwright/test';

async function seed(page: Page, nodeId = 'twilight-welcome', extra: Record<string, unknown> = {}) {
  await page.addInitScript(({ nodeId, extra }) => {
    localStorage.setItem('sophia-estrella-settings-v1', JSON.stringify({ muted: true, reducedMotion: true, textSpeed: 'instant', ...extra }));
    localStorage.setItem('sophia-estrella-save-v1', JSON.stringify({ nodeId, background: 'ponyville', history: [] }));
  }, { nodeId, extra });
}
async function continueGame(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: /^Continuar/ }).click();
  await expect(page.locator('.game-shell')).toBeVisible();
}
async function currentNode(page: Page) {
  return page.evaluate(() => JSON.parse(localStorage.getItem('sophia-estrella-save-v1')!).nodeId);
}

test('new game, manual and quick saves, history, reload and restoration', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: /Nueva partida/ }).click();
  await page.getByRole('button', { name: 'Comenzar aventura', exact: true }).click();
  await expect(page.locator('.scene-card')).toBeInViewport();
  await page.locator('.scene-card').click();
  await page.locator('.dialogue-panel').click();
  await page.locator('.dialogue-panel').click();
  await expect.poll(() => currentNode(page)).toBe('twilight-welcome');
  await page.getByRole('button', { name: 'G. rápida', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Guardado rápido');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await page.getByRole('button', { name: /Partida 1/ }).click();
  await expect(page.getByRole('status')).toContainText('Partida 1 guardada');
  await page.getByRole('button', { name: /Partida 1/ }).click();
  await expect(page.getByRole('alert')).toContainText('Reemplazar');
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Historial', exact: true }).click();
  await expect(page.locator('.history-list')).toContainText('El camino de piedra');
  await page.keyboard.press('Escape');
  await page.locator('.dialogue-panel').click();
  if (await currentNode(page) === 'twilight-welcome') await page.locator('.dialogue-panel').click();
  await expect.poll(() => currentNode(page)).toBe('spike-list');
  await page.getByRole('button', { name: 'C. rápida', exact: true }).click();
  await page.getByRole('button', { name: 'Cargar guardado rápido', exact: true }).click();
  await expect.poll(() => currentNode(page)).toBe('twilight-welcome');
  await page.reload();
  await page.getByRole('button', { name: /Cargar partida/ }).click();
  await page.getByRole('button', { name: /Partida 1/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Cargar partida', exact: true }).click();
  await expect.poll(() => currentNode(page)).toBe('twilight-welcome');
  expect(errors).toEqual([]);
});

test('typing and automatic reading pause in dialogs; settings persist', async ({ page }) => {
  await seed(page, 'twilight-welcome', { textSpeed: 'slow', autoDelay: 1 });
  await continueGame(page);
  await page.getByRole('button', { name: 'Configuración', exact: true }).click();
  const before = await page.locator('.dialogue-visible').textContent();
  await page.waitForTimeout(400);
  expect(await page.locator('.dialogue-visible').textContent()).toBe(before);
  await page.getByRole('button', { name: 'Instantánea', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.dialogue-panel')).toHaveAttribute('aria-label', 'Continuar');
  await page.getByRole('button', { name: 'Auto', exact: true }).click();
  await page.getByRole('button', { name: 'Configuración', exact: true }).click();
  await page.waitForTimeout(5300);
  expect(await currentNode(page)).toBe('twilight-welcome');
  await page.keyboard.press('Escape');
  await expect.poll(() => currentNode(page), { timeout: 8000 }).toBe('spike-list');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('sophia-estrella-settings-v1')!).textSpeed)).toBe('instant');
});

test('automatic reading advances through chapter cards', async ({ page }) => {
  await seed(page, 'twilight-invite', { textSpeed: 'instant', autoDelay: 1 });
  await continueGame(page);
  await page.getByRole('button', { name: 'Auto', exact: true }).click();
  await expect.poll(() => currentNode(page), { timeout: 10000 }).toBe('pinkie-entrance');
  expect(await page.getByRole('button', { name: 'Auto', exact: true }).getAttribute('aria-pressed')).toBe('true');
});

test('skip stops at unread text; hide restores without advancing', async ({ page }) => {
  await seed(page, 'twilight-welcome', { textSpeed: 'slow' });
  await page.addInitScript(() => localStorage.setItem('sophia-estrella-read-v1', JSON.stringify(['twilight-welcome'])));
  await continueGame(page);
  await page.getByRole('button', { name: 'Saltar', exact: true }).click();
  await expect.poll(() => currentNode(page)).toBe('spike-list');
  await expect(page.getByRole('button', { name: 'Saltar', exact: true })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: 'Ocultar interfaz', exact: true }).click();
  await expect(page.locator('.dialogue-panel')).toBeHidden();
  await page.keyboard.press('Escape');
  await expect(page.locator('.dialogue-panel')).toBeVisible();
  expect(await currentNode(page)).toBe('spike-list');
});

test('chapter loading leads to a playable scene', async ({ page }) => {
  await seed(page, 'twilight-invite');
  await continueGame(page);
  await page.locator('.dialogue-panel').click();
  await expect(page.locator('.loading-overlay')).toBeVisible();
  await expect(page.locator('.scene-card')).toContainText('El salón de los preparativos');
  await page.locator('.scene-card').click();
  await expect.poll(() => currentNode(page)).toBe('pinkie-entrance');
});

test('loading failures can be retried without losing the saved game', async ({ page }) => {
  await seed(page);
  await page.route('**/assets/menu/ponies-group.png', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
  expect(await currentNode(page)).toBe('twilight-welcome');
  await page.unroute('**/assets/menu/ponies-group.png');
  await page.getByRole('button', { name: 'Reintentar' }).click();
  await expect(page.getByRole('button', { name: /^Continuar/ })).toBeEnabled({ timeout: 20000 });
});

test('cursor draws stars, does not intercept clicks, and can be disabled', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Configuración', exact: true }).click();
  await page.getByRole('button', { name: 'Pantalla', exact: true }).click();
  await page.mouse.move(400, 250);
  await page.mouse.down();
  await expect.poll(() => page.locator('dialog canvas').evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    return canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data.some((value, index) => index % 4 === 3 && value > 0);
  })).toBe(true);
  await page.mouse.up();
  await page.getByRole('switch', { name: 'Cursor mágico' }).click();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('switch', { name: 'Reducir movimiento' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
});

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }, { width: 2560, height: 1080 }]) {
  test(`anchored portraits and centered accessible dialogs at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await seed(page, 'twilight-welcome', { textSize: 125 });
    await continueGame(page);
    await expect(page.locator('.dialogue-panel')).toHaveAttribute('aria-label', 'Continuar');
    const panel = (await page.locator('.dialogue-panel').boundingBox())!;
    const portrait = (await page.locator('.portrait-stage').boundingBox())!;
    const text = (await page.locator('.dialogue-copy').boundingBox())!;
    expect(text.y + text.height).toBeLessThan(panel.y + panel.height);
    expect(Math.abs(portrait.y + portrait.height - panel.y - 18)).toBeLessThan(2);
    expect(portrait.y).toBeGreaterThanOrEqual(58);
    expect(portrait.height).toBeGreaterThan(30);
    expect(panel.y + panel.height).toBeLessThan(viewport.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(viewport.width);
    await page.screenshot({ path: `test-results/game-${viewport.width}.png` });
    await page.getByRole('button', { name: 'Configuración', exact: true }).click();
    const dialog = (await page.getByRole('dialog').boundingBox())!;
    expect(Math.abs(dialog.x + dialog.width / 2 - viewport.width / 2)).toBeLessThan(2);
    expect(Math.abs(dialog.y + dialog.height / 2 - viewport.height / 2)).toBeLessThan(2);
    for (let index = 0; index < 15; index++) {
      await page.keyboard.press('Tab');
      expect(await page.evaluate(() => !!document.activeElement?.closest('dialog'))).toBe(true);
    }
    await page.screenshot({ path: `test-results/settings-${viewport.width}.png` });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', { name: 'Configuración', exact: true })).toBeFocused();
  });
}
