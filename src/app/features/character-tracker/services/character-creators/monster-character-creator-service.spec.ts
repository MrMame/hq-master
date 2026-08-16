import { TestBed } from '@angular/core/testing';

import { MonsterCharacterCreatorService } from './monster-character-creator-service';

describe('Monsters', () => {
  let service: MonsterCharacterCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonsterCharacterCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
