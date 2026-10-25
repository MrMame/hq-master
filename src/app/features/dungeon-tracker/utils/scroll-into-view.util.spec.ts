import { scrollIntoViewIfNeeded } from './scroll-into-view.util';

describe('scrollIntoViewIfNeeded', () => {
  const element: () => HTMLElement = (): HTMLElement => {
    const div: HTMLElement = document.createElement('div');
    div.scrollIntoView = vi.fn();
    return div;
  };

  it('scrolls only as far as needed in both directions', () => {
    const token: HTMLElement = element();

    scrollIntoViewIfNeeded(token);

    expect(token.scrollIntoView).toHaveBeenCalledExactlyOnceWith({
      block: 'nearest',
      inline: 'nearest',
    });
  });

  it('scrolls several elements in the given order', () => {
    const [token, bar]: HTMLElement[] = [element(), element()];
    const order: string[] = [];
    vi.mocked(token.scrollIntoView).mockImplementation(() => order.push('token'));
    vi.mocked(bar.scrollIntoView).mockImplementation(() => order.push('bar'));

    scrollIntoViewIfNeeded(token, bar);

    expect(order).toEqual(['token', 'bar']);
  });
});
