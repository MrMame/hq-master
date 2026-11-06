import { expect, Locator, Page, test } from '@playwright/test';
import { createCharacter } from './support/create-character';

function legendEntry(page: Page): Locator {
  return page.locator('aside app-dungeon-legend-entry');
}

test('poison set in the editor shows at token and legend and ticks on +1 h in the time tracker', async ({
  page,
}) => {
  await createCharacter(page, 'Ork', { health: 20, armor: 5 });

  const token: Locator = page.locator('app-dungeon-token');
  await token.getByRole('img', { name: 'Ork' }).dblclick();
  const editor: Locator = page.getByRole('dialog', { name: 'Charakter bearbeiten' });
  await editor.getByRole('checkbox', { name: 'Gift' }).check();
  await editor.getByRole('button', { name: 'Übernehmen' }).click();
  await expect(editor).toBeHidden();

  await expect(
    token.getByTestId('token-conditions').getByRole('img', { name: 'Gift – noch 10:00' }),
  ).toBeVisible();
  await expect(legendEntry(page).getByRole('img', { name: 'Gift – noch 10:00' })).toHaveText(
    '10:00',
  );

  await page.getByRole('link', { name: 'Time Tracker' }).click();
  const row: Locator = page.getByTestId('active-condition-row');
  await expect(row).toContainText('Ork');
  await expect(row).toContainText('Gift');

  await page.getByRole('button', { name: '1 Stunde vorrücken' }).click();
  await expect(page.getByText('Keine aktiven Zustände')).toBeVisible();
  const logEntries: Locator = page.getByTestId('game-log-entry');
  await expect(logEntries.first()).toContainText('+1 h');
  await expect(logEntries.nth(1)).toContainText('Gift bei Ork abgelaufen');
  await expect(logEntries.filter({ hasText: 'Ork: 1 Schaden durch Gift' })).toHaveCount(10);

  await page.getByRole('link', { name: 'Dungeon Tracker' }).click();
  await expect(legendEntry(page).getByLabel('Leben', { exact: true })).toHaveText('10/20');
  await expect(token.getByRole('img', { name: /Gift/ })).toHaveCount(0);

  await page.reload();
  await expect(legendEntry(page).getByLabel('Leben', { exact: true })).toHaveText('10/20');
});
