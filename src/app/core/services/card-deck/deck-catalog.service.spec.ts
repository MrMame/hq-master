import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { DECK_CATALOG_URL, DeckCatalogService } from './deck-catalog.service';

describe('DeckCatalogService', () => {
  let service: DeckCatalogService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DeckCatalogService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  it('is loading without entries until the catalog arrives', () => {
    expect(service.isLoading()).toBe(true);
    expect(service.entries()).toEqual([]);
    expect(service.loadError()).toBeNull();
    http.expectOne(DECK_CATALOG_URL);
  });

  it('provides the loaded entries', async () => {
    http.expectOne(DECK_CATALOG_URL).flush([{ id: 'm', name: 'Monster', url: 'decks/m/m.xml' }]);

    await vi.waitFor(() => expect(service.isLoading()).toBe(false));
    expect(service.entries()).toEqual([{ id: 'm', name: 'Monster', url: 'decks/m/m.xml' }]);
    expect(service.loadError()).toBeNull();
  });

  it('loads the catalog only once', () => {
    TestBed.inject(DeckCatalogService);
    http.expectOne(DECK_CATALOG_URL);
  });

  it('reports a missing catalog file', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    http.expectOne(DECK_CATALOG_URL).flush('weg', { status: 404, statusText: 'Not Found' });

    await vi.waitFor(() => expect(service.isLoading()).toBe(false));
    expect(service.loadError()).toBe('Deckliste konnte nicht geladen werden.');
    expect(service.entries()).toEqual([]);
  });

  it('reports a catalog with invalid content', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    http.expectOne(DECK_CATALOG_URL).flush({ decks: [] });

    await vi.waitFor(() => expect(service.loadError()).not.toBeNull());
    expect(service.entries()).toEqual([]);
  });
});
