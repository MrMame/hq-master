import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { GameTimeService } from '../../../../core/services/game-time/game-time.service';
import { GameTime } from '../../../../core/models/game-time.model';
import { ConfirmationDialog } from '../../../../shared/components/confirmation-dialog/confirmation-dialog';
import { SessionMeta } from '../../models/session-meta.model';
import { SessionSnapshot } from '../../models/session-snapshot.model';
import { GameSessionService } from '../../services/game-session.service';
import { SessionFileService } from '../../services/session-file.service';
import { SessionXmlService } from '../../services/session-xml.service';
import { parseDateTimeLocal } from '../../utils/date-time-local.util';

const DEFAULT_START_TIME: string = '2390-05-06T07:00';

@Component({
  selector: 'app-game-session-page',
  imports: [FormsModule],
  templateUrl: './game-session-page.html',
  styleUrl: './game-session-page.scss',
})
export class GameSessionPage {
  private readonly gameSessionService: GameSessionService = inject(GameSessionService);
  private readonly sessionXmlService: SessionXmlService = inject(SessionXmlService);
  private readonly sessionFileService: SessionFileService = inject(SessionFileService);
  private readonly dialog: MatDialog = inject(MatDialog);

  protected readonly gameTimeService: GameTimeService = inject(GameTimeService);
  protected readonly meta: Signal<SessionMeta> = this.gameSessionService.meta;

  protected readonly sessionName: WritableSignal<string> = signal<string>('');
  protected readonly startTime: WritableSignal<string> = signal<string>(DEFAULT_START_TIME);
  protected readonly errorMessage: WritableSignal<string | null> = signal<string | null>(null);

  async startSession(): Promise<void> {
    const startTime: GameTime | null = parseDateTimeLocal(this.startTime());
    if (!startTime) {
      this.errorMessage.set('Bitte eine gültige Ingame-Startzeit angeben.');
      return;
    }
    if (!(await this.confirm())) return;
    this.gameSessionService.startSession({ name: this.sessionName().trim(), startTime });
    this.errorMessage.set(null);
  }

  endSession(): void {
    this.gameSessionService.endSession();
  }

  saveSession(): void {
    const xml: string = this.sessionXmlService.serialize(this.gameSessionService.snapshot());
    this.sessionFileService.download(xml, buildFileName(this.meta().name));
  }

  async loadSession(event: Event): Promise<void> {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const file: File | undefined = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const xml: string = await this.sessionFileService.readText(file);
      const snapshot: SessionSnapshot = this.sessionXmlService.parse(xml);
      if (!(await this.confirm())) return;
      this.gameSessionService.restoreSnapshot(snapshot);
      this.errorMessage.set(null);
    } catch (error: unknown) {
      this.errorMessage.set(error instanceof Error ? error.message : String(error));
    }
  }

  private async confirm(): Promise<boolean> {
    const dialogRef: MatDialogRef<ConfirmationDialog, boolean> = this.dialog.open<
      ConfirmationDialog,
      unknown,
      boolean
    >(ConfirmationDialog);
    return (await firstValueFrom(dialogRef.afterClosed())) === true;
  }
}

function buildFileName(sessionName: string): string {
  const slug: string = sessionName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${slug || 'game-session'}.xml`;
}
