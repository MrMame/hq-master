import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeckForm } from './add-deck-form';
import { DeckConfig } from '../../../../core/models/deck-config.model';
import { createTwoDeckState } from '../../../../core/testing/deck.fixtures';
import {
  CardManagerTestbed,
  configureCardManagerTestbed,
} from '../../testing/card-manager-page.fixtures';

describe('AddDeckForm', () => {
  let testbed: CardManagerTestbed;
  let fixture: ComponentFixture<AddDeckForm>;
  let host: HTMLElement;

  const input: () => HTMLInputElement = () => host.querySelector('input')!;
  const button: () => HTMLButtonElement = () => host.querySelector('button')!;
  const submit: (url: string) => Promise<void> = async (url) => {
    input().value = url;
    button().click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    testbed = configureCardManagerTestbed();
    testbed.cardManager.restore(createTwoDeckState());
    fixture = TestBed.createComponent(AddDeckForm);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('starts with the default deck file', () => {
    expect(input().value).toBe('decks/default/default-deck.xml');
    expect(button().textContent?.trim()).toBe('Deck hinzufügen');
  });

  it('adds the deck from the trimmed path and keeps the existing decks', async () => {
    await submit('  decks/x.xml ');
    expect(testbed.loadFromUrl).toHaveBeenCalledExactlyOnceWith('decks/x.xml');
    expect(testbed.cardManager.decks().map((deck) => deck.name)).toEqual([
      'Testdeck',
      'Testdeck (2)',
      'Testdeck (3)',
    ]);
  });

  it('ignores an empty path', async () => {
    await submit('   ');
    expect(testbed.loadFromUrl).not.toHaveBeenCalled();
  });

  it('shows the loading state while the deck loads', async () => {
    testbed.loadFromUrl.mockReturnValue(new Promise<DeckConfig>(() => undefined));
    await submit('decks/x.xml');
    expect(button().disabled).toBe(true);
    expect(button().textContent?.trim()).toBe('Lade …');
  });

  it('shows the error of a failed load and clears it on the next try', async () => {
    testbed.loadFromUrl.mockRejectedValueOnce(new Error('Datei fehlt'));
    await submit('decks/x.xml');
    expect(host.querySelector('[data-testid="deck-load-error"]')?.textContent).toBe('Datei fehlt');
    expect(button().disabled).toBe(false);

    await submit('decks/x.xml');
    expect(host.querySelector('[data-testid="deck-load-error"]')).toBeNull();
  });

  it('shows a general message for errors without text', async () => {
    testbed.loadFromUrl.mockRejectedValueOnce('kaputt');
    await submit('decks/x.xml');
    expect(host.querySelector('[data-testid="deck-load-error"]')?.textContent).toBe(
      'Deck konnte nicht geladen werden.',
    );
  });
});
