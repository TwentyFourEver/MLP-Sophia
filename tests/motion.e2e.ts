import { expect, test, type Locator } from '@playwright/test';

async function expectMovement(element: Locator) {
  await expect.poll(() => element.evaluate((target) => getComputedStyle(target).transform)).not.toBe('none');
  const samples = await element.evaluate(async (target) => {
    const transforms = new Set<string>();
    for (let index = 0; index < 12; index++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      transforms.add(getComputedStyle(target).transform);
    }
    return [...transforms];
  });
  expect(samples.length).toBeGreaterThan(2);
}

for (const reducedMotion of ['reduce', 'no-preference'] as const) {
  test(`animations stay visible and can be switched off and on with system ${reducedMotion}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion });
    await page.addInitScript(() => {
      localStorage.setItem('sophia-estrella-settings-v1', JSON.stringify({ muted: true, textSpeed: 'instant' }));
      localStorage.setItem('sophia-estrella-save-v1', JSON.stringify({ nodeId: 'twilight-welcome', background: 'ponyville' }));
    });
    await page.goto('/');
    await expect(page.getByRole('button', { name: /^Continuar/ })).toBeVisible({ timeout: 20000 });
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'false');
    await expectMovement(page.locator('.menu-artwork__image'));
    await page.getByRole('button', { name: /^Continuar/ }).click();
    await expect(page.locator('.portrait-image')).toBeVisible();
    await expectMovement(page.locator('.portrait-image'));
    await page.getByRole('button', { name: 'Configuración', exact: true }).click();
    await page.getByRole('button', { name: 'Pantalla', exact: true }).click();
    await page.getByRole('switch', { name: 'Reducir movimiento' }).click();
    await page.keyboard.press('Escape');
    await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
    await expect(page.locator('.portrait-image')).toHaveCSS('transform', 'none');
    await expect(page.locator('.story-frame')).toHaveCSS('transform', 'none');
    await expect(page.locator('.dialogue-panel')).toBeVisible();
    await page.getByRole('button', { name: 'Configuración', exact: true }).click();
    await page.getByRole('button', { name: 'Pantalla', exact: true }).click();
    await page.getByRole('switch', { name: 'Reducir movimiento' }).click();
    await page.keyboard.press('Escape');
    await expectMovement(page.locator('.portrait-image'));
    const anchor = await page.locator('.story-frame').evaluate((frame) => {
      const portrait = frame.querySelector<HTMLElement>('.portrait-stage')!;
      const panel = frame.querySelector<HTMLElement>('.dialogue-panel')!;
      return portrait.offsetTop + portrait.offsetHeight - panel.offsetTop;
    });
    expect(anchor).toBe(18);
    if (reducedMotion === 'reduce') {
      await page.getByRole('button', { name: 'Configuración', exact: true }).click();
      await page.getByRole('button', { name: 'Pantalla', exact: true }).click();
      await page.getByRole('switch', { name: 'Seguir el ajuste del sistema' }).click();
      await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'true');
      await page.getByRole('switch', { name: 'Seguir el ajuste del sistema' }).click();
      await expect(page.locator('html')).toHaveAttribute('data-reduced-motion', 'false');
    }
  });
}
