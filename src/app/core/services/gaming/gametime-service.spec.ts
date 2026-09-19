import { TestBed } from '@angular/core/testing';

import { GametimeService } from './gametime-service';

describe('GametimeService', () => {
  let service: GametimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GametimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
