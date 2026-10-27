import { expect, test } from '@playwright/test';

/** Eindeutiger Inhalt je Feature-Seite, an dem erkennbar ist, dass die lazy Route geladen hat. */
const pages: { path: string; marker: string }[] = [
  { path: '/timetracker', marker: '+1 Hour' },
  { path: '/dungeontracker', marker: 'Dungeon Tracker' },
  { path: '/dungeonbuilder', marker: 'Dungeon Builder' },
  { path: '/cardmanager', marker: 'Deck laden' },
  { path: '/gamesession', marker: 'Aktuelle Session' },
];

for (const { path, marker } of pages) {
  test(`route ${path} loads its page`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole('main').getByText(marker, { exact: true })).toBeVisible();
  });
}

// `/charactertracker` gibt es nicht mehr; alte Lesezeichen landen ebenfalls im Dungeon Tracker.
for (const path of ['/', '/gibt-es-nicht', '/charactertracker']) {
  test(`route ${path} redirects to the dungeon tracker`, async ({ page }) => {
    await page.goto(path);
    await expect(page).toHaveURL(/\/dungeontracker$/);
    await expect(
      page.getByRole('main').getByText('Dungeon Tracker', { exact: true }),
    ).toBeVisible();
  });
}
