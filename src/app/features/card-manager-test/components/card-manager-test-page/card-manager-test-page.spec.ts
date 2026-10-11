import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardManagerTestPage } from './card-manager-test-page';

describe('CardManagerTestPage', () => {
  let component: CardManagerTestPage;
  let fixture: ComponentFixture<CardManagerTestPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardManagerTestPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CardManagerTestPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
