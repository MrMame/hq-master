import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { CATALOG_URL, ElementCatalogService } from './element-catalog.service';

describe('ElementCatalogService', () => {
  let service: ElementCatalogService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ElementCatalogService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    vi.restoreAllMocks();
  });

  it('should be empty while the catalog loads', () => {
    expect(service.catalog()).toBeNull();
    expect(service.loadError()).toBeNull();
    http.expectOne(CATALOG_URL);
  });

  it('should provide the loaded catalog', async () => {
    http
      .expectOne(CATALOG_URL)
      .flush('<catalog><floors><floor id="room" name="Raum" image="r.svg"/></floors></catalog>');

    await vi.waitFor(() => expect(service.catalog()?.floors[0].name).toBe('Raum'));
    expect(service.loadError()).toBeNull();
  });

  it('should report a missing catalog file', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    http.expectOne(CATALOG_URL).flush('weg', { status: 404, statusText: 'Not Found' });

    await vi.waitFor(() =>
      expect(service.loadError()).toBe('Bibliothek konnte nicht geladen werden.'),
    );
    expect(service.catalog()).toBeNull();
  });

  it('should report a catalog that is no valid XML', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    http.expectOne(CATALOG_URL).flush('<deck/>');

    await vi.waitFor(() => expect(service.loadError()).not.toBeNull());
  });
});
