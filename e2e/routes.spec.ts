import { expect, test } from '@playwright/test';

/** Eindeutiger Inhalt je Feature-Seite, an dem erkennbar ist, dass die lazy Route geladen hat. */
const pages: { path: string; marker: string }[] = [
  { path: '/charactertracker', marker: 'Add Monster' },
  { path: '/timetracker', marker: '+1 Hour' },
  { path: '/dungeontracker', marker: 'Dungeon Tracker' },
  { path: '/cardmanager', marker: 'Deck laden' },
  { path: '/gamesession', marker: 'Aktuelle Session' },
];

for (const { path, marker } of pages) {
  test(`route ${path} loads its page`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('main').getByText(marker, { exact: true })).toBeVisible();
  });
}

for (const path of ['/', '/gibt-es-nicht']) {
  test(`route ${path} redirects to the character tracker`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/charactertracker$/);
    await expect(page.getByRole('main').getByText('Add Monster', { exact: true })).toBeVisible();
  });
}
