import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { ConfirmationDialogComponent } from './confirmation-dialog';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
      providers: [{ provide: MatDialogRef, useValue: { close: () => {} } }],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
