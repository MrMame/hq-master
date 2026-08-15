import { TestBed } from '@angular/core/testing';

import { Monsters } from './monsters';

describe('Monsters', () => {
  let service: Monsters;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Monsters);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
