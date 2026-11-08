import { Locator, Page } from '@playwright/test';

/** Wählt das Deck in der Auswahlliste der Seitenleiste und legt es als neues Deck auf den Tisch. */
export async function addDeck(page: Page, deckName: string): Promise<void> {
  const sidebar: Locator = page.getByRole('complementary');
  await sidebar.getByRole('combobox', { name: 'Deck auswählen' }).selectOption({ label: deckName });
  await sidebar.getByRole('button', { name: 'Deck hinzufügen' }).click();
}
