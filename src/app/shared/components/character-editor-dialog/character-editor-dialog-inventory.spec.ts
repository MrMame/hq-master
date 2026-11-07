import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { MockInstance, vi } from 'vitest';

import { CardManagerService } from '../../../core/services/card-deck/card-manager.service';
import { GameLogService } from '../../../core/services/game-log/game-log.service';
import { DeckState } from '../../../core/models/deck-state.model';
import { EquipmentCard } from '../../../core/models/card.model';
import {
  createEquipmentCard,
  inventoryCard,
  RUNE_ARMOR,
  TOWER_SHIELD,
} from '../../../core/testing/deck.fixtures';
import { CharacterEditorDialogSetup } from '../../testing/character-editor-dialog.fixtures';
import {
  equippedDeck,
  EQUIPPED_BARBARIAN,
  equipmentRows,
  renderCardViewer,
  setupEquippedEditor,
  statBonus,
  viewButton,
  viewerAction,
} from '../../testing/character-equipment.fixtures';

const CHAIN_MAIL: EquipmentCard = createEquipmentCard('e5', 'Kettenhemd', 'body', [
  { stat: 'maxArmor', value: 1 },
]);

/** Barbar mit Turmschild links; die Runenrüstung liegt im Inventar statt am Körper. */
function inventoryDeck(): DeckState {
  const deck: DeckState = equippedDeck();
  return {
    ...deck,
    assigned: deck.assigned.filter((entry) => entry.card !== RUNE_ARMOR),
    inventory: [inventoryCard(RUNE_ARMOR, 'a')],
  };
}

describe('CharacterEditorDialog – inventory', () => {
  const deck: () => DeckState = () => TestBed.inject(CardManagerService).state();
  const inventoryNames: (host: HTMLElement) => string[] = (host) =>
    Array.from(host.querySelectorAll('.inventory-editor__name')).map((el) => el.textContent ?? '');

  async function open(setup: CharacterEditorDialogSetup, label: string): Promise<HTMLElement> {
    const overlay: HTMLElement = await renderCardViewer();
    await setup.click(viewButton(setup.host, 'Runenrüstung'));
    await setup.click(viewerAction(overlay, label)!);
    return overlay;
  }

  it('lists the inventory under the equipment; a card there gives no bonus', async () => {
    const { host }: CharacterEditorDialogSetup = await setupEquippedEditor(inventoryDeck());
    expect(inventoryNames(host)).toEqual(['Runenrüstung']);
    expect(statBonus(host, 'maxArmor')).toBeNull();
  });

  it('equips from the inventory in the draft and raises armor only on apply', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor(inventoryDeck());
    const overlay: HTMLElement = await open(setup, 'Anlegen');

    expect(overlay.querySelector('[data-testid="card-viewer-location"]')?.textContent).toContain(
      'Barbar · Körper',
    );
    expect(equipmentRows(setup.host)).toContain('Körper Runenrüstung');
    expect(setup.host.textContent).toContain('Keine Karten im Inventar');
    expect(statBonus(setup.host, 'maxArmor')?.textContent).toContain('+2');
    expect(deck().inventory).toHaveLength(1);

    await (await setup.button('Übernehmen')).click();
    expect(deck().inventory).toEqual([]);
    // 6/4 mit Grundmaximum 4: am Körper → 6 + 2 = 8 auf das Maximum 6 begrenzt.
    expect(setup.characters()[0]).toMatchObject({ armor: 6 });
    expect(TestBed.inject(GameLogService).entries()[0].text).toBe(
      'Runenrüstung von Barbar aus dem Inventar angelegt',
    );
  });

  it('stows a slot card in the draft and keeps everything on cancel', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor();
    await open(setup, 'Ins Inventar legen');

    expect(inventoryNames(setup.host)).toEqual(['Runenrüstung']);
    expect(equipmentRows(setup.host)).toContain('Körper frei');
    await (await setup.button('Abbrechen')).click();
    expect(deck().inventory).toEqual([]);
    expect(setup.characters()[0]).toEqual(EQUIPPED_BARBARIAN);
  });

  it('discards an inventory card on apply', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor(inventoryDeck());
    await open(setup, 'In den Ablagestapel legen');
    await (await setup.button('Übernehmen')).click();
    expect(deck().decks[0].discardPile).toEqual([RUNE_ARMOR]);
    expect(deck().assigned.map((entry) => entry.card)).toEqual([TOWER_SHIELD]);
  });

  it('asks where the previous card goes when the slot is taken in the draft', async () => {
    const setup: CharacterEditorDialogSetup = await setupEquippedEditor({
      ...equippedDeck(),
      inventory: [inventoryCard(CHAIN_MAIL, 'a')],
    });
    const open: MockInstance = vi
      .spyOn(TestBed.inject(MatDialog), 'open')
      .mockReturnValue({ afterClosed: () => of('inventory') } as never);
    const overlay: HTMLElement = await renderCardViewer();
    await setup.click(viewButton(setup.host, 'Kettenhemd'));
    await setup.click(viewerAction(overlay, 'Anlegen')!);
    expect(open).toHaveBeenCalledTimes(1);
    expect(inventoryNames(setup.host)).toEqual(['Runenrüstung']);
    expect(equipmentRows(setup.host)).toContain('Körper Kettenhemd');
  });
});
