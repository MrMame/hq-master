import { expect, Locator, Page, test } from '@playwright/test';

/** Der geöffnete Charakter-Editor (Material-Dialog). */
function editor(page: Page): Locator {
  return page.getByRole('dialog');
}

/** Seitenleiste des Dungeon Trackers mit der Charakter-Legende. */
function sidebar(page: Page): Locator {
  return page.locator('aside');
}

test('a character edited via double click keeps its new name after a reload', async ({ page }) => {
  await page.goto('/charactertracker');
  await page.getByRole('button', { name: 'Add Monster' }).click();
  await page.goto('/dungeontracker');

  await page.locator('app-dungeon-token > div').dblclick();
  await expect(editor(page).getByRole('heading', { name: 'Charakter bearbeiten' })).toBeVisible();
  await editor(page).getByLabel('Name').fill('Grimgor');
  await editor(page).getByRole('button', { name: 'Übernehmen' }).click();

  await expect(editor(page)).toBeHidden();
  await expect(page).toHaveURL(/\/dungeontracker$/);
  await expect(sidebar(page).getByText('Grimgor')).toBeVisible();

  await page.reload();

  await expect(sidebar(page).getByText('Grimgor')).toBeVisible();
});

test('"Character Neu" adds a character as token and legend entry', async ({ page }) => {
  await page.goto('/dungeontracker');
  await expect(page.locator('app-dungeon-token')).toHaveCount(0);

  await sidebar(page).getByRole('button', { name: 'Character Neu' }).click();
  await expect(editor(page).getByRole('heading', { name: 'Neuer Charakter' })).toBeVisible();
  await editor(page).getByLabel('Name').fill('Neuling');
  await editor(page).getByRole('button', { name: 'Bild 1', exact: true }).click();
  await editor(page).getByRole('button', { name: 'Übernehmen' }).click();

  await expect(editor(page)).toBeHidden();
  await expect(sidebar(page).getByText('Charaktere (1)')).toBeVisible();
  await expect(sidebar(page).getByText('Neuling')).toBeVisible();
  await expect(page.locator('app-dungeon-token')).toHaveCount(1);
});
