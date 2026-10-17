import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read back a written value', () => {
    service.writeToLocalStorage<{ a: number }>('value', { a: 1 });
    expect(service.readFromLocalStorage<{ a: number }>('value')).toEqual({ a: 1 });
  });

  it('should return null for missing keys', () => {
    expect(service.readFromLocalStorage<string>('missing')).toBeNull();
  });

  it('should return null and warn on invalid JSON', () => {
    const warnSpy: ReturnType<typeof vi.spyOn> = vi
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    localStorage.setItem('broken', '{not json');

    expect(service.readFromLocalStorage<string>('broken')).toBeNull();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});
