import { TestBed } from '@angular/core/testing';

import { FileTransferService } from './file-transfer.service';

describe('FileTransferService', () => {
  let service: FileTransferService;
  let click: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileTransferService);
    URL.createObjectURL = vi.fn(() => 'blob:file');
    URL.revokeObjectURL = vi.fn();
    click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function downloadedBlob(): Blob {
    return vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob;
  }

  it('should download a text as a named XML file by default', () => {
    service.download('<gameSession/>', 'runde.xml');

    expect(downloadedBlob().type).toBe('application/xml');
    expect(click).toHaveBeenCalledTimes(1);
    expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe('runde.xml');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:file');
  });

  it('should use the given MIME type for a text', () => {
    service.download('Hallo', 'notiz.txt', 'text/plain');

    expect(downloadedBlob().type).toBe('text/plain');
  });

  it('should download a Blob unchanged', () => {
    const image: Blob = new Blob(['jpeg'], { type: 'image/jpeg' });

    service.download(image, 'gruft.jpg');

    expect(downloadedBlob()).toBe(image);
    expect((click.mock.contexts[0] as HTMLAnchorElement).download).toBe('gruft.jpg');
  });

  it('should read the text of a file', async () => {
    const file: File = new File(['<gameSession/>'], 'runde.xml', { type: 'application/xml' });
    await expect(service.readText(file)).resolves.toBe('<gameSession/>');
  });
});
