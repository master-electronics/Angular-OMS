import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
} from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { map, of } from 'rxjs';
import { PrinterService } from '../../data/printer';

@Component({
  standalone: true,
  selector: 'printer-button',
  imports: [CommonModule, NzIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      title="Print ITN"
      (click)="onClick()"
      type="button"
      [disabled]="printer$ | async"
    >
      <icon
        nz-icon
        style="font-size: 32px;"
        nzType="printer"
        nzTheme="outline"
      ></icon>
    </button>
  `,
})
export class PrinterButtomComponent implements OnInit {
  constructor(private _print: PrinterService) {}
  @Input() ITN: string;
  public printer$;

  ngOnInit() {
    this.printer$ = of(false);
  }

  public onClick(): void {
    if (this.ITN) {
      this.printer$ = this._print.printITN$(this.ITN).pipe(map(() => false));
    }
  }
}
