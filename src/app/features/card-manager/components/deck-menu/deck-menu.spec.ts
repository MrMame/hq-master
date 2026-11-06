import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { Mock } from 'vitest';

import { DeckMenu } from './deck-menu';
import { DeckInstance } from '../../../../core/models/deck-state.model';
import { createTwoDeckState } from '../../../../core/testing/deck.fixtures';
import { DeckActionsService } from '../../services/deck-actions.service';
import {
  CardManagerTestbed,
  configureCardManagerTestbed,
} from '../../testing/card-manager-page.fixtures';

describe('DeckMenu', () => {
  let testbed: CardManagerTestbed;
  let fixture: ComponentFixture<DeckMenu>;
  let menu: MatMenuHarness;
  let rename: Mock<(deck: DeckInstance) => Promise<void>>;
  let remove: Mock<(deck: DeckInstance) => Promise<void>>;

  const names: () => string[] = () => testbed.cardManager.decks().map((deck) => deck.id);

  async function open(index: number, first: boolean, last: boolean): Promise<void> {
    fixture = TestBed.createComponent(DeckMenu);
    fixture.componentRef.setInput('deck', testbed.cardManager.decks()[index]);
    fixture.componentRef.setInput('first', first);
    fixture.componentRef.setInput('last', last);
    menu = await TestbedHarnessEnvironment.loader(fixture).getHarness(MatMenuHarness);
    await menu.open();
  }

  beforeEach(() => {
    rename = vi.fn().mockResolvedValue(undefined);
    remove = vi.fn().mockResolvedValue(undefined);
    testbed = configureCardManagerTestbed([
      { provide: DeckActionsService, useValue: { rename, remove } },
    ]);
    testbed.cardManager.restore(createTwoDeckState());
  });

  it('labels the trigger with the deck name and offers all deck actions', async () => {
    await open(1, false, true);
    expect(await (await menu.host()).getAttribute('aria-label')).toBe('Aktionen für Testdeck (2)');
    const items: string[] = await Promise.all(
      (await menu.getItems()).map((item) => item.getText()),
    );
    expect(items).toEqual([
      'Mischen',
      'Zurücksetzen',
      'Umbenennen',
      'Nach oben',
      'Nach unten',
      'Entfernen',
    ]);
  });

  it('disables moving beyond the first or last position', async () => {
    await open(1, false, true);
    expect(await (await menu.getItems({ text: 'Nach unten' }))[0].isDisabled()).toBe(true);
    expect(await (await menu.getItems({ text: 'Nach oben' }))[0].isDisabled()).toBe(false);
  });

  it('moves the deck up', async () => {
    await open(1, false, true);
    await menu.clickItem({ text: 'Nach oben' });
    expect(names()).toEqual(['deck-2', 'deck-1']);
  });

  it('resets only this deck', async () => {
    testbed.cardManager.draw('deck-2');
    await open(1, false, true);
    await menu.clickItem({ text: 'Zurücksetzen' });
    expect(testbed.cardManager.state().activeCard).toBeNull();
    expect(testbed.cardManager.decks()[1].drawPile).toHaveLength(2);
    expect(testbed.cardManager.decks()[0].drawPile).toHaveLength(1);
  });

  it('shuffles only this deck', async () => {
    const other: DeckInstance = testbed.cardManager.decks()[0];
    await open(1, false, true);
    await menu.clickItem({ text: 'Mischen' });
    expect(testbed.cardManager.decks()[1].drawPile).toHaveLength(2);
    expect(testbed.cardManager.decks()[0]).toBe(other);
  });

  it('hands renaming and removing to the deck actions', async () => {
    const deck: DeckInstance = testbed.cardManager.decks()[0];
    await open(0, true, false);
    await menu.clickItem({ text: 'Umbenennen' });
    await menu.open();
    await menu.clickItem({ text: 'Entfernen' });
    expect(rename).toHaveBeenCalledWith(deck);
    expect(remove).toHaveBeenCalledWith(deck);
  });

  it('moves the deck down', async () => {
    await open(0, true, false);
    await menu.clickItem({ text: 'Nach unten' });
    expect(names()).toEqual(['deck-2', 'deck-1']);
  });
});
