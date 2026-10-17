import { Download, expect, Page, test } from '@playwright/test';

/** Werte aus `SESSION_KEYS` (src/app/core/session-state/session-keys.ts). */
const SESSION_KEYS: string[] = [
  'characters',
  'game_time',
  'dungeon_board',
  'dungeon_positions',
  'card_manager_deck_state',
  'game_session_meta',
  'character_card_layout',
];

/** Gesamter persistierter Session-Zustand, als JSON geparst. */
function readSessionState(page: Page): Promise<Record<string, unknown>> {
  return page.evaluate((keys: string[]) => {
    const state: Record<string, unknown> = {};
    for (const key of keys) {
      const raw: string | null = localStorage.getItem(key);
      state[key] = raw === null ? null : JSON.parse(raw);
    }
    return state;
  }, SESSION_KEYS);
}

async function confirm(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Bestätigen' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
}

test('an exported session can be imported again with identical state', async ({ page }) => {
  await page.goto('/charactertracker');
  await page.getByRole('button', { name: 'Add Monster' }).click();
  await page.getByRole('button', { name: 'Add Hero' }).click();
  await page.goto('/gamesession');
  await page.getByTestId('session-name').fill('E2E Gruft');
  await page.getByTestId('start-session').click();
  await confirm(page);
  await expect(page.getByTestId('session-state')).toContainText('Aktiv – E2E Gruft');
  const exported: Record<string, unknown> = await readSessionState(page);

  const downloadPromise: Promise<Download> = page.waitForEvent('download');
  await page.getByTestId('save-session').click();
  const download: Download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('e2e-gruft.xml');
  const filePath: string = await download.path();

  await page.goto('/charactertracker');
  await page.getByRole('button', { name: 'Add Monster' }).click();
  await page.goto('/gamesession');
  await page.getByTestId('end-session').click();
  expect(await readSessionState(page)).not.toEqual(exported);

  await page.getByTestId('load-session').setInputFiles(filePath);
  await confirm(page);

  await expect(page.getByTestId('session-state')).toContainText('Aktiv – E2E Gruft');
  expect(await readSessionState(page)).toEqual(exported);
});
