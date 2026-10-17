import { TestBed } from '@angular/core/testing';

import { GameSessionService } from '../../services/game-session.service';
import { SessionFileService } from '../../services/session-file.service';
import { SessionXmlService } from '../../services/session-xml.service';
import { createSessionSnapshot } from '../../testing/session.fixtures';
import {
  GameSessionPageSetup,
  setupGameSessionPage,
  typeInto,
} from '../../testing/game-session-page.fixtures';

describe('GameSessionPage – save and load', () => {
  let page: GameSessionPageSetup;
  let service: GameSessionService;
  let fileService: SessionFileService;

  beforeEach(async () => {
    page = await setupGameSessionPage();
    service = TestBed.inject(GameSessionService);
    fileService = TestBed.inject(SessionFileService);
  });

  /** Wählt Dateien am File-Input aus und wartet, bis der Import verarbeitet ist. */
  const selectFiles: (files: File[]) => Promise<void> = async (files: File[]): Promise<void> => {
    const input: HTMLInputElement = page.byTestId<HTMLInputElement>('load-session');
    Object.defineProperty(input, 'files', { value: files });
    input.dispatchEvent(new Event('change'));
    await page.fixture.whenStable();
  };

  const sessionFile: () => File = (): File =>
    new File([TestBed.inject(SessionXmlService).serialize(createSessionSnapshot())], 'gruft.xml');

  it.each<[string, string]>([
    ['', 'game-session.xml'],
    ['Die Gruft 2!', 'die-gruft-2.xml'],
  ])('should download the snapshot for session name "%s" as %s', async (name, fileName) => {
    const download: ReturnType<typeof vi.spyOn> = vi
      .spyOn(fileService, 'download')
      .mockImplementation(() => undefined);
    if (name) {
      typeInto(page.byTestId<HTMLInputElement>('session-name'), name);
      page.byTestId<HTMLButtonElement>('start-session').click();
      await page.fixture.whenStable();
    }

    page.byTestId<HTMLButtonElement>('save-session').click();

    expect(download).toHaveBeenCalledWith(expect.stringContaining('<gameSession'), fileName);
  });

  it('should restore a selected session file after confirmation', async () => {
    await selectFiles([sessionFile()]);

    await vi.waitFor(() => expect(service.meta().name).toBe('Gruft'));
    expect(page.readText('session-error')).toBe('');
  });

  it('should keep the current session when loading is cancelled', async () => {
    page.confirmWith(false);
    const restore: ReturnType<typeof vi.spyOn> = vi.spyOn(service, 'restoreSnapshot');

    await selectFiles([sessionFile()]);

    await vi.waitFor(() => expect(page.dialogOpen).toHaveBeenCalled());
    expect(restore).not.toHaveBeenCalled();
  });

  it('should ignore a selection without a file', async () => {
    const readText: ReturnType<typeof vi.spyOn> = vi.spyOn(fileService, 'readText');
    await selectFiles([]);
    expect(readText).not.toHaveBeenCalled();
  });

  it('should show an error for an invalid session file', async () => {
    await selectFiles([new File(['kein xml'], 'x.xml')]);

    await vi.waitFor(() =>
      expect(page.readText('session-error')).toContain('Ungültige Session-Datei'),
    );
  });

  it('should show a non-Error failure as text', async () => {
    vi.spyOn(fileService, 'readText').mockRejectedValue('Lesefehler');

    await selectFiles([new File(['x'], 'x.xml')]);

    await vi.waitFor(() => expect(page.readText('session-error')).toBe('Lesefehler'));
  });
});
