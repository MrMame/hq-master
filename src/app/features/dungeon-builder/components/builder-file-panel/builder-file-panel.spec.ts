import { clickButton } from '../../../../shared/testing/click-button';
import { createTestLayout } from '../../testing/builder.fixtures';
import { FilePanelSetup, setupFilePanel } from '../../testing/builder-file-panel.fixtures';

describe('BuilderFilePanel', () => {
  let p: FilePanelSetup;

  beforeEach(() => {
    p = setupFilePanel();
  });

  it('should start a new layout without asking while the current one is empty', async () => {
    clickButton(p.host, 'Neu');
    await p.fixture.whenStable();
    expect(p.confirm).not.toHaveBeenCalled();
    expect(p.services.layout.layout().name).toBe('Neues Layout');
  });

  it('should ask before discarding a non-empty layout and keep it on cancel', async () => {
    p.services.layout.paintFloor([{ col: 0, row: 0 }], 'room');
    p.confirm.mockResolvedValueOnce(false);
    clickButton(p.host, 'Neu');
    await p.fixture.whenStable();
    expect(p.services.layout.layout().floor).toEqual({ '0,0': 'room' });

    clickButton(p.host, 'Neu');
    await p.fixture.whenStable();
    expect(p.confirm).toHaveBeenCalledWith(expect.objectContaining({ confirmLabel: 'Verwerfen' }));
    expect(p.services.layout.layout().floor).toEqual({});
  });

  it('should save the layout as XML named after the layout', () => {
    clickButton(p.host, 'Als XML speichern');
    expect(p.download).toHaveBeenCalledWith(
      expect.stringContaining('<dungeonLayout version="1" name="Gruft des Hexers"'),
      'gruft-des-hexers.xml',
    );
  });

  it('should export a JPEG named after the layout', async () => {
    clickButton(p.host, 'Als JPEG exportieren');
    await vi.waitFor(() => expect(p.download).toHaveBeenCalled());

    expect(p.exportJpeg).toHaveBeenCalledWith(p.services.layout.layout(), p.services.catalog());
    expect(p.download).toHaveBeenCalledWith(expect.any(Blob), 'gruft-des-hexers.jpg');
  });

  it('should show an export error and enable the button again', async () => {
    p.exportJpeg.mockRejectedValueOnce(new Error('Grafik fehlt.'));
    clickButton(p.host, 'Als JPEG exportieren');
    await vi.waitFor(() => expect(p.message('builder-file-error')).toBe('Grafik fehlt.'));

    const button: HTMLButtonElement = Array.from(p.host.querySelectorAll('button')).find((b) =>
      b.textContent?.includes('JPEG'),
    )!;
    expect(button.disabled).toBe(false);

    p.exportJpeg.mockRejectedValueOnce('kaputt');
    clickButton(p.host, 'Als JPEG exportieren');
    await vi.waitFor(() => expect(p.message('builder-file-error')).toBe('kaputt'));
  });

  it.each<[number, string]>([
    [1, '1 Element ohne Katalogeintrag'],
    [2, '2 Elemente ohne Katalogeintrag'],
  ])('should count %s element(s) without catalog entry', (count, text) => {
    const ids: string[] = ['x', 'y'].slice(0, count);
    p.services.layout.replace(
      createTestLayout({
        pieces: ids.map((id) => ({ id, catalogId: 'weg', col: 0, row: 0, rotation: 0 })),
      }),
    );
    p.fixture.detectChanges();
    expect(p.message('builder-unknown-elements')).toContain(text);
  });
});
