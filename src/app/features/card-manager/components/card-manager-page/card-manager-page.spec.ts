import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardManagerPage } from './card-manager-page';

describe('CardManagerPage', () => {
  let component: CardManagerPage;
  let fixture: ComponentFixture<CardManagerPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardManagerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CardManagerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
