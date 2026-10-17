import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeTrackerPage } from './time-tracker-page';

describe('TimeTrackerPage', () => {
  let component: TimeTrackerPage;
  let fixture: ComponentFixture<TimeTrackerPage>;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [TimeTrackerPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TimeTrackerPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the current game time in the label', () => {
    expect(readLabel()).toBe('Spielzeit: 23:55:00 2381-01-01');
  });

  it('should update the label when time is added', async () => {
    component.addTime1Hour();
    await fixture.whenStable();
    expect(readLabel()).toBe('Spielzeit: 00:55:00 2381-01-02');
  });

  it.each([
    [1, 'Spielzeit: 23:55:01 2381-01-01'],
    [5, 'Spielzeit: 23:55:05 2381-01-01'],
    [10, 'Spielzeit: 23:55:10 2381-01-01'],
  ])('should add %i second(s) via button', async (step: number, expected: string) => {
    const element: HTMLElement = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    element.querySelector<HTMLButtonElement>(`[data-testid="add-seconds-${step}"]`)?.click();
    await fixture.whenStable();
    expect(readLabel()).toBe(expected);
  });

  it.each([
    ['+1 Hour', 'Spielzeit: 00:55:00 2381-01-02'],
    ['+8 Hours', 'Spielzeit: 07:55:00 2381-01-02'],
  ])('should add time via the "%s" button', async (text: string, expected: string) => {
    const element: HTMLElement = fixture.nativeElement as HTMLElement;
    const button: HTMLButtonElement | undefined = Array.from(
      element.querySelectorAll('button'),
    ).find((b) => b.textContent?.trim() === text);

    button!.click();
    await fixture.whenStable();

    expect(readLabel()).toBe(expected);
  });

  const readLabel: () => string = (): string => {
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement as HTMLElement;
    return element.querySelector('[data-testid="game-time-label"]')?.textContent?.trim() ?? '';
  };
});
