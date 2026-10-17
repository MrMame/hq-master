import { expect, Locator, Page, test } from '@playwright/test';

/** Rastergröße in px laut `DEFAULT_DUNGEON_BOARD_STATE.gridCellSizePx`. */
const CELL: number = 60;

/** Positionsanzeige `[col,row]` des (einzigen) Charakters in der Legende der Seitenleiste. */
function legend(page: Page): Locator {
  return page.locator('aside span.ml-auto');
}

/** Spielfeld-Koordinate aus der Legende. */
async function legendPosition(page: Page): Promise<[number, number]> {
  const text: string = (await legend(page).textContent()) ?? '';
  const [col, row]: number[] = (text.match(/\d+/g) ?? []).map(Number);
  if (col === undefined || row === undefined) throw new Error(`Keine Position in "${text}"`);
  return [col, row];
}

test('a dragged token keeps its new field after a reload', async ({ page }) => {
  await page.goto('/charactertracker');
  await page.getByRole('button', { name: 'Add Monster' }).click();
  await page.goto('/dungeontracker');

  const token: Locator = page.locator('app-dungeon-token > div');
  await expect(token).toBeVisible();
  const [col, row]: [number, number] = await legendPosition(page);

  const box: { x: number; y: number; width: number; height: number } | null =
    await token.boundingBox();
  if (!box) throw new Error('Token ohne Position');
  const startX: number = box.x + box.width / 2;
  const startY: number = box.y + box.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 2 * CELL, startY + CELL, { steps: 10 });
  await page.mouse.up();

  const expected: string = `[${col + 2},${row + 1}]`;
  await expect(legend(page)).toHaveText(expected);

  await page.reload();

  await expect(legend(page)).toHaveText(expected);
});
