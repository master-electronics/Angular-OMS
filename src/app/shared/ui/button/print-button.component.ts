import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PrinterService } from '../../data/printer';

@Component({
  standalone: true,
  selector: 'printer-button',
  imports: [CommonModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button title="Print ITN" (click)="onClick()" type="button">
      <icon
        nz-icon
        style="font-size: 32px;"
        nzType="printer"
        nzTheme="outline"
      ></icon>
    </button>
    <ng-container *ngIf="printer$ | async"></ng-container>
  `,
})
export class PrinterButtomComponent {
  constructor(private _print: PrinterService) {}
  @Input() ITN: string;
  public printer$;

  public onClick(): void {
    this.printer$ = this._print.printITN$(this.ITN);
  }
}
