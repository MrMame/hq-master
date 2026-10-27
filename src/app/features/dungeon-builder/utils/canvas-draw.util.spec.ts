import { RenderStep } from '../models/render-step.model';
import { createFakeContext, FakeContext } from '../testing/canvas.fixtures';
import { drawStep, imageSources, UNKNOWN_FILL } from './canvas-draw.util';

const IMAGE_STEP: RenderStep = {
  kind: 'image',
  key: 'p:t1',
  src: 'img/table.svg',
  placement: {
    translateX: 96,
    translateY: 64,
    rotation: 180,
    x: -96,
    y: -64,
    width: 192,
    height: 128,
  },
};

describe('canvas-draw.util', () => {
  let fake: FakeContext;

  beforeEach(() => {
    fake = createFakeContext();
  });

  it('lists every image source once', () => {
    expect(imageSources([IMAGE_STEP, IMAGE_STEP, { ...IMAGE_STEP, src: 'b.svg' }])).toEqual([
      'img/table.svg',
      'b.svg',
    ]);
  });

  it('draws an image moved and turned around its placement', () => {
    const image: CanvasImageSource = {} as HTMLImageElement;
    drawStep(fake.context, IMAGE_STEP, new Map([['img/table.svg', image]]));

    expect(fake.calls.translate).toHaveBeenCalledWith(96, 64);
    expect(fake.calls.rotate).toHaveBeenCalledWith(Math.PI);
    expect(fake.calls.drawImage).toHaveBeenCalledWith(image, -96, -64, 192, 128);
    expect(fake.calls.restore).toHaveBeenCalled();
  });

  it('skips an image that was not loaded', () => {
    drawStep(fake.context, IMAGE_STEP, new Map());
    expect(fake.calls.drawImage).not.toHaveBeenCalled();
  });

  it('draws rectangles, lines and placeholders', () => {
    drawStep(
      fake.context,
      { kind: 'rect', key: 'r', color: '#000', x: 0, y: 0, width: 10, height: 5 },
      new Map(),
    );
    drawStep(
      fake.context,
      { kind: 'line', key: 'l', color: '#fff', width: 4, x1: 0, y1: 1, x2: 8, y2: 1 },
      new Map(),
    );
    drawStep(
      fake.context,
      { kind: 'unknown', key: 'u', x: 64, y: 0, width: 16, height: 64 },
      new Map(),
    );

    expect(fake.calls.fillRect).toHaveBeenCalledWith(0, 0, 10, 5);
    expect(fake.calls.moveTo).toHaveBeenCalledWith(0, 1);
    expect(fake.calls.lineTo).toHaveBeenCalledWith(8, 1);
    expect(fake.context.lineWidth).toBe(4);
    expect(fake.calls.fillRect).toHaveBeenLastCalledWith(64, 0, 16, 64);
    expect(fake.calls.fillText).toHaveBeenCalledWith('?', 72, 32);
    expect(fake.context.font).toBe('bold 11.2px sans-serif');
    expect(UNKNOWN_FILL).toMatch(/^#/);
  });
});
