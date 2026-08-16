import { TestBed } from '@angular/core/testing';

import { HeroCharacterCreatorService } from '../hero-character-creator-service';

describe('HeroCharacterCreatorService', () => {
  let service: HeroCharacterCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroCharacterCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
