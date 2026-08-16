import { TestBed } from '@angular/core/testing';

import { CharactersDbService } from './CharactersDbService';

describe('CharactersDbService', () => {
  let service: CharactersDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharactersDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
