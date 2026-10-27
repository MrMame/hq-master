import { Component, inject, Signal } from '@angular/core';
import { ConfirmationService } from '../../../../shared/services/confirmation.service';
import { DungeonLayout, LAYOUT_SIZE_LIMITS } from '../../models/dungeon-layout.model';
import { DungeonLayoutService } from '../../services/dungeon-layout.service';
import { ElementCatalogService } from '../../services/element-catalog.service';
import { elementsOutside } from '../../utils/layout-resize.util';

/** Layoutname (bestimmt die Dateinamen) und Plangröße in Kacheln. */
@Component({
  selector: 'app-layout-settings',
  template: `
    <label class="layout-settings__field">
      Layoutname
      <input
        type="text"
        class="layout-settings__input"
        data-testid="layout-name"
        [value]="layout().name"
        (input)="layoutService.rename(text($event))"
      />
    </label>
    <div class="layout-settings__size">
      <label class="layout-settings__field">
        Spalten
        <input
          type="number"
          class="layout-settings__input"
          data-testid="layout-columns"
          [min]="limits.min"
          [max]="limits.max"
          [value]="layout().columns"
          (change)="onSizeChange($event, 'columns')"
        />
      </label>
      <label class="layout-settings__field">
        Zeilen
        <input
          type="number"
          class="layout-settings__input"
          data-testid="layout-rows"
          [min]="limits.min"
          [max]="limits.max"
          [value]="layout().rows"
          (change)="onSizeChange($event, 'rows')"
        />
      </label>
    </div>
  `,
  styleUrl: './layout-settings.css',
})
export class LayoutSettings {
  protected readonly layoutService: DungeonLayoutService = inject(DungeonLayoutService);
  private readonly catalogService: ElementCatalogService = inject(ElementCatalogService);
  private readonly confirmation: ConfirmationService = inject(ConfirmationService);

  protected readonly layout: Signal<DungeonLayout> = this.layoutService.layout;
  protected readonly limits: { min: number; max: number } = LAYOUT_SIZE_LIMITS;

  protected text(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  /**
   * Übernimmt eine gültige Größe. Fallen dabei Elemente weg, fragt der Dialog vorher; bei
   * „Abbrechen“ oder ungültiger Eingabe zeigt das Feld wieder die bisherige Größe.
   */
  protected async onSizeChange(event: Event, dimension: 'columns' | 'rows'): Promise<void> {
    const input: HTMLInputElement = event.target as HTMLInputElement;
    const value: number = Number(input.value);
    const current: DungeonLayout = this.layout();
    const size: { columns: number; rows: number } = {
      columns: current.columns,
      rows: current.rows,
      [dimension]: value,
    };
    const valid: boolean =
      Number.isInteger(value) && value >= this.limits.min && value <= this.limits.max;
    if (valid && (await this.confirmLoss(current, size))) {
      this.layoutService.resize(size.columns, size.rows);
      return;
    }
    input.value = String(current[dimension]);
  }

  private async confirmLoss(
    layout: DungeonLayout,
    size: { columns: number; rows: number },
  ): Promise<boolean> {
    const lost: number = elementsOutside(layout, size, this.catalogService.catalog());
    if (lost === 0) return true;
    return this.confirmation.confirm({
      title: 'Plan verkleinern',
      message: `${lost} ${lost === 1 ? 'Element liegt' : 'Elemente liegen'} außerhalb und ${lost === 1 ? 'wird' : 'werden'} entfernt.`,
      confirmLabel: 'Verkleinern',
    });
  }
}
