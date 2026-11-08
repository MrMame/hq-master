import { expect, Locator, test } from '@playwright/test';
import { createCharacter } from './support/create-character';

test('puts a drawn card into the belt of a character and keeps it after a reload', async ({
  page,
}) => {
  await createCharacter(page, 'Barbar', { Leben: 20 });
  await page.goto('/cardmanager');
  await page.getByRole('complementary').getByRole('button', { name: 'Deck hinzufügen' }).click();
  await page.getByRole('button', { name: 'Karte ziehen aus Zwerg' }).click();

  const viewer: Locator = page.getByRole('dialog', { name: 'Card Viewer' });
  const location: Locator = viewer.getByTestId('card-viewer-location');
  await expect(location).toHaveText('Zwerg · Hand');
  await viewer.getByRole('button', { name: 'Aktionen' }).click();
  await viewer.getByRole('menuitem', { name: 'In den Gürtel legen' }).click();
  await viewer.getByRole('menuitem', { name: 'Barbar' }).click();
  await expect(location).toHaveText('Zwerg · Gürtel von Barbar');
  await page.keyboard.press('Escape');

  const belt: Locator = page.getByRole('region', { name: 'Gürtel', exact: true });
  await expect(belt.getByRole('heading', { name: 'Barbar (1)' })).toBeVisible();

  await page.reload();
  await expect(belt.getByRole('heading', { name: 'Barbar (1)' })).toBeVisible();
  await belt.getByTestId('belt-card').click();
  await expect(location).toHaveText('Zwerg · Gürtel von Barbar');
});
