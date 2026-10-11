import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardManagerPage } from './card-manager-page';

describe('CardManagerPage', (): void => {
  let component: CardManagerPage;
  let fixture: ComponentFixture<CardManagerPage>;

  beforeEach(async (): Promise<void> => {
    await TestBed.configureTestingModule({
      imports: [CardManagerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(CardManagerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', (): void => {
    expect(component).toBeTruthy();
  });
});
