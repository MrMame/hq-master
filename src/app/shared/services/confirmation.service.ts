import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ConfirmationDialog } from '../components/confirmation-dialog/confirmation-dialog';
import { ConfirmationDialogData } from '../models/confirmation-dialog-data.model';

/** Öffnet den gemeinsamen `ConfirmationDialog` und liefert, ob der Nutzer bestätigt hat. */
@Injectable({
  providedIn: 'root',
})
export class ConfirmationService {
  private readonly dialog: MatDialog = inject(MatDialog);

  async confirm(data: ConfirmationDialogData = {}): Promise<boolean> {
    const dialogRef: MatDialogRef<ConfirmationDialog, boolean> = this.dialog.open<
      ConfirmationDialog,
      ConfirmationDialogData,
      boolean
    >(ConfirmationDialog, { data });
    return (await firstValueFrom(dialogRef.afterClosed())) === true;
  }
}
