import { TestBed } from '@angular/core/testing';

import { MonsterCharacterCreatorService } from './MonsterCharacterCreatorService';

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
