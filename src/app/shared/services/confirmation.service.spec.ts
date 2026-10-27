import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Mock } from 'vitest';

import { ConfirmationDialog } from '../components/confirmation-dialog/confirmation-dialog';
import { ConfirmationService } from './confirmation.service';

describe('ConfirmationService', () => {
  let open: Mock;
  let service: ConfirmationService;

  const closeWith: (result: boolean | undefined) => void = (result: boolean | undefined): void => {
    open.mockReturnValue({ afterClosed: () => of(result) });
  };

  beforeEach(() => {
    open = vi.fn();
    TestBed.configureTestingModule({ providers: [{ provide: MatDialog, useValue: { open } }] });
    service = TestBed.inject(ConfirmationService);
  });

  it('should open the confirmation dialog with the given texts', async () => {
    closeWith(true);

    await service.confirm({ title: 'Layout verwerfen?', confirmLabel: 'Verwerfen' });

    expect(open).toHaveBeenCalledWith(ConfirmationDialog, {
      data: { title: 'Layout verwerfen?', confirmLabel: 'Verwerfen' },
    });
  });

  it.each<[boolean | undefined, boolean]>([
    [true, true],
    [false, false],
    [undefined, false],
  ])('should resolve %s as %s', async (result, expected) => {
    closeWith(result);

    await expect(service.confirm()).resolves.toBe(expected);
  });
});
