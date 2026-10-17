import { expect, Locator, test } from '@playwright/test';

test('a created character is still there after a reload', async ({ page }) => {
  await page.goto('/charactertracker');
  const cards: Locator = page.locator('app-movable-character-card');
  await expect(cards).toHaveCount(0);

  await page.getByRole('button', { name: 'Add Monster' }).click();
  await expect(cards).toHaveCount(1);
  const title: string = (await cards.locator('.handle').textContent()) ?? '';

  await page.reload();

  await expect(cards).toHaveCount(1);
  await expect(cards.locator('.handle')).toHaveText(title);
});
