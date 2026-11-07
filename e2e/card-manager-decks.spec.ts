import { expect, Locator, Page, test } from '@playwright/test';

async function addDefaultDeck(page: Page): Promise<void> {
  await page.getByRole('complementary').getByRole('button', { name: 'Deck hinzufügen' }).click();
}

test('keeps cards drawn from two decks in the hand and discards one via the card viewer', async ({
  page,
}) => {
  await page.goto('/cardmanager');
  await addDefaultDeck(page);
  await addDefaultDeck(page);
  const rows: Locator = page.getByTestId('deck-row');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(1)).toContainText('Beispieldeck (2)');

  // Ziehen öffnet die Karte im Viewer; Escape schließt ihn, die Karte bleibt in der Hand.
  const viewer: Locator = page.getByRole('dialog', { name: 'Card Viewer' });
  const location: Locator = viewer.getByTestId('card-viewer-location');
  await rows.nth(0).getByRole('button', { name: 'Karte ziehen aus Beispieldeck' }).click();
  await expect(location).toHaveText('Beispieldeck · Hand');
  await page.keyboard.press('Escape');
  await expect(viewer).toHaveCount(0);
  await rows.nth(1).getByRole('button', { name: 'Karte ziehen aus Beispieldeck (2)' }).click();
  await expect(location).toHaveText('Beispieldeck (2) · Hand');
  await page.keyboard.press('Escape');

  const hand: Locator = page.getByRole('region', { name: 'Hand des Dungeon Masters' });
  await expect(hand.getByRole('heading')).toHaveText('Hand des Dungeon Masters (2)');
  await expect(rows.nth(0).getByTestId('discard-count')).toHaveText('0');

  await hand.getByTestId('hand-card').first().click();
  await expect(location).toHaveText('Beispieldeck · Hand');
  await viewer.getByRole('menuitem', { name: 'In den Ablagestapel legen' }).click();
  await expect(location).toHaveText('Beispieldeck · Ablagestapel');
  await page.keyboard.press('Escape');

  await expect(hand.getByRole('heading')).toHaveText('Hand des Dungeon Masters (1)');
  await expect(rows.nth(0).getByTestId('discard-count')).toHaveText('1');
  await expect(rows.nth(1).getByTestId('discard-count')).toHaveText('0');

  await page.reload();
  await expect(rows).toHaveCount(2);
  await expect(hand.getByRole('heading')).toHaveText('Hand des Dungeon Masters (1)');
  await expect(hand).toContainText('aus Beispieldeck (2)');
  await expect(rows.nth(0).getByTestId('discard-count')).toHaveText('1');
});
