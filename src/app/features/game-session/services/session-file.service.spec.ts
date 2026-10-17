import { TestBed } from '@angular/core/testing';

import { SessionFileService } from './session-file.service';

describe('SessionFileService', () => {
  let service: SessionFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionFileService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should download the content as a named file', () => {
    URL.createObjectURL = vi.fn(() => 'blob:session');
    URL.revokeObjectURL = vi.fn();
    const click: ReturnType<typeof vi.spyOn> = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => undefined);

    service.download('<gameSession/>', 'runde.xml');

    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(click).toHaveBeenCalledTimes(1);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:session');
  });

  it('should read the text of a file', async () => {
    const file: File = new File(['<gameSession/>'], 'runde.xml', { type: 'application/xml' });
    await expect(service.readText(file)).resolves.toBe('<gameSession/>');
  });
});
