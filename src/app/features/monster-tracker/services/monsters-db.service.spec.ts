import { TestBed } from '@angular/core/testing';

import { MonstersDbService } from './monsters-db.service';

describe('MonstersDbService', () => {
  let service: MonstersDbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MonstersDbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
