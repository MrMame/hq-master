import { expect, Locator, Page, test } from '@playwright/test';

async function addDefaultDeck(page: Page): Promise<void> {
  await page.getByRole('complementary').getByRole('button', { name: 'Deck hinzufügen' }).click();
}

test('draws from two decks one after another and keeps them after a reload', async ({ page }) => {
  await page.goto('/cardmanager');
  await addDefaultDeck(page);
  await addDefaultDeck(page);
  const rows: Locator = page.getByTestId('deck-row');
  await expect(rows).toHaveCount(2);
  await expect(rows.nth(1)).toContainText('Beispieldeck (2)');

  await rows.nth(0).getByRole('button', { name: 'Karte ziehen aus Beispieldeck' }).click();
  await expect(page.getByTestId('active-card-deck')).toHaveText('Beispieldeck');

  // Die erste Karte kommt beim Ziehen aus dem zweiten Deck in den Ablagestapel ihres eigenen Decks.
  await rows.nth(1).getByRole('button', { name: 'Karte ziehen aus Beispieldeck (2)' }).click();
  await expect(page.getByTestId('active-card-deck')).toHaveText('Beispieldeck (2)');
  await expect(rows.nth(0).getByTestId('discard-count')).toHaveText('1');
  await expect(rows.nth(1).getByTestId('discard-count')).toHaveText('0');

  await page.reload();
  await expect(rows).toHaveCount(2);
  await expect(page.getByTestId('active-card-deck')).toHaveText('Beispieldeck (2)');
  await expect(rows.nth(0).getByTestId('discard-count')).toHaveText('1');
});
