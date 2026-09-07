import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCharacterDialog } from './add-character-dialog';

describe('AddCharacterDialog', () => {
  let component: AddCharacterDialog;
  let fixture: ComponentFixture<AddCharacterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCharacterDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(AddCharacterDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
