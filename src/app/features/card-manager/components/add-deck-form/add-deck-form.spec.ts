import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeckForm } from './add-deck-form';
import { DeckConfig } from '../../../../core/models/deck-config.model';
import { DeckCatalogEntry } from '../../../../core/models/deck-catalog-entry.model';
import {
  DECK_CATALOG_URL,
  DeckCatalogService,
} from '../../../../core/services/card-deck/deck-catalog.service';
import { createDeckInstance } from '../../../../core/testing/deck.fixtures';
import {
  CardManagerTestbed,
  configureCardManagerTestbed,
  DEFAULT_CATALOG_ENTRY,
} from '../../testing/card-manager-page.fixtures';

const MONSTER: DeckCatalogEntry = { id: 'monster', name: 'Monster', url: 'decks/m/monster.xml' };

describe('AddDeckForm', () => {
  let testbed: CardManagerTestbed;
  let http: HttpTestingController;
  let fixture: ComponentFixture<AddDeckForm>;
  let host: HTMLElement;

  const select: () => HTMLSelectElement = () => host.querySelector('select')!;
  const button: () => HTMLButtonElement = () => host.querySelector('button')!;
  const hint: () => string | undefined = () =>
    host.querySelector('[data-testid="deck-catalog-hint"]')?.textContent?.trim();
  const flushCatalog: (
    body: string | DeckCatalogEntry[],
    status?: number,
  ) => Promise<void> = async (body, status) => {
    const options: { status: number; statusText: string } | undefined =
      status === undefined ? undefined : { status, statusText: 'Fehler' };
    http.expectOne(DECK_CATALOG_URL).flush(body, options);
    // Die Antwort kommt erst nach einem Microtask im Signal an.
    await vi.waitFor(() => expect(TestBed.inject(DeckCatalogService).isLoading()).toBe(false));
    await fixture.whenStable();
  };
  const add: () => Promise<void> = async () => {
    button().click();
    await fixture.whenStable();
  };

  beforeEach(async () => {
    testbed = configureCardManagerTestbed([
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: DeckCatalogService, useClass: DeckCatalogService },
    ]);
    http = TestBed.inject(HttpTestingController);
    testbed.loadFromUrl.mockResolvedValue({ ...createDeckInstance().config, name: 'Monster' });
    fixture = TestBed.createComponent(AddDeckForm);
    host = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  it('disables list and button while the catalog loads', async () => {
    expect(hint()).toBe('Decks werden geladen …');
    expect(select().disabled).toBe(true);
    expect(button().disabled).toBe(true);
    await flushCatalog([DEFAULT_CATALOG_ENTRY]);
  });

  it('lists all decks by name with the first one preselected and no path field', async () => {
    await flushCatalog([DEFAULT_CATALOG_ENTRY, MONSTER]);
    expect(Array.from(select().options).map((option) => option.textContent?.trim())).toEqual([
      'Beispieldeck',
      'Monster',
    ]);
    expect(select().value).toBe(DEFAULT_CATALOG_ENTRY.url);
    expect(host.querySelector('input')).toBeNull();
    expect(hint()).toBeUndefined();
    expect(button().disabled).toBe(false);
  });

  it('adds the chosen deck again and again without changing the choice', async () => {
    await flushCatalog([DEFAULT_CATALOG_ENTRY, MONSTER]);
    select().value = MONSTER.url;
    select().dispatchEvent(new Event('change'));
    await add();
    await add();

    expect(testbed.loadFromUrl).toHaveBeenCalledTimes(2);
    expect(testbed.loadFromUrl).toHaveBeenLastCalledWith(MONSTER.url);
    expect(testbed.cardManager.decks().map((deck) => deck.name)).toEqual([
      'Monster',
      'Monster (2)',
    ]);
    expect(select().value).toBe(MONSTER.url);
  });

  it('reports a catalog that cannot be loaded', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    await flushCatalog('weg', 404);
    expect(hint()).toBe('Deckliste konnte nicht geladen werden.');
    expect(button().disabled).toBe(true);
  });

  it('reports an empty catalog', async () => {
    await flushCatalog([]);
    expect(hint()).toBe('Keine Decks unter public/decks gefunden.');
    expect(button().disabled).toBe(true);
  });

  it('shows the loading state while the deck loads', async () => {
    await flushCatalog([DEFAULT_CATALOG_ENTRY]);
    testbed.loadFromUrl.mockReturnValue(new Promise<DeckConfig>(() => undefined));
    await add();
    expect(button().disabled).toBe(true);
    expect(button().textContent?.trim()).toBe('Lade …');
  });

  it('shows the error of a failed load and clears it on the next try', async () => {
    await flushCatalog([DEFAULT_CATALOG_ENTRY]);
    testbed.loadFromUrl.mockRejectedValueOnce(new Error('Datei fehlt'));
    await add();
    expect(host.querySelector('[data-testid="deck-load-error"]')?.textContent).toBe('Datei fehlt');
    expect(button().disabled).toBe(false);

    await add();
    expect(host.querySelector('[data-testid="deck-load-error"]')).toBeNull();
  });

  it('shows a general message for errors without text', async () => {
    await flushCatalog([DEFAULT_CATALOG_ENTRY]);
    testbed.loadFromUrl.mockRejectedValueOnce('kaputt');
    await add();
    expect(host.querySelector('[data-testid="deck-load-error"]')?.textContent).toBe(
      'Deck konnte nicht geladen werden.',
    );
  });
});
