import { TestBed } from '@angular/core/testing';

import { LayoutXmlService } from '../../services/layout-xml.service';
import { createTestLayout } from '../../testing/builder.fixtures';
import { FilePanelSetup, setupFilePanel } from '../../testing/builder-file-panel.fixtures';

describe('BuilderFilePanel – load', () => {
  let p: FilePanelSetup;

  beforeEach(() => {
    p = setupFilePanel();
  });

  const savedFile: () => string = (): string =>
    TestBed.inject(LayoutXmlService).serialize(createTestLayout({ name: 'Geladen' }));

  it('should load a saved layout file without asking while the current one is empty', async () => {
    await p.selectFile(savedFile());

    await vi.waitFor(() => expect(p.services.layout.layout().name).toBe('Geladen'));
    expect(p.confirm).not.toHaveBeenCalled();
    expect(p.message('builder-file-error')).toBe('');
  });

  it('should ask before replacing a non-empty layout and keep it on cancel', async () => {
    p.services.layout.paintFloor([{ col: 0, row: 0 }], 'room');
    p.confirm.mockResolvedValueOnce(false);

    await p.selectFile(savedFile());
    await vi.waitFor(() => expect(p.confirm).toHaveBeenCalledTimes(1));
    expect(p.services.layout.layout().name).toBe('Gruft des Hexers');

    await p.selectFile(savedFile());
    await vi.waitFor(() => expect(p.services.layout.layout().name).toBe('Geladen'));
  });

  it('should show why a file cannot be loaded and keep the layout', async () => {
    await p.selectFile('<deck/>');

    await vi.waitFor(() =>
      expect(p.message('builder-file-error')).toBe(
        'Ungültige Layout-Datei: Wurzelelement <dungeonLayout> fehlt.',
      ),
    );
    expect(p.services.layout.layout().name).toBe('Gruft des Hexers');
  });

  it('should ignore an empty file selection', async () => {
    const input: HTMLInputElement = p.host.querySelector('[data-testid="load-layout"]')!;
    input.dispatchEvent(new Event('change'));
    await p.fixture.whenStable();

    expect(p.services.layout.layout().name).toBe('Gruft des Hexers');
  });

  it('should show a non-error failure as text', async () => {
    vi.spyOn(TestBed.inject(LayoutXmlService), 'parse').mockImplementation(() => {
      throw 'kaputt';
    });
    await p.selectFile('<dungeonLayout/>');

    await vi.waitFor(() => expect(p.message('builder-file-error')).toBe('kaputt'));
  });
});
