import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { map, of } from 'rxjs';
import { PrinterService } from '../../data/printer';

@Component({
  standalone: true,
  selector: 'printer-button',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      class="h-full w-full"
      title="Print ITN"
      (click)="onClick()"
      type="button"
      [disabled]="printer$ | async"
    >
      <svg
        style="height: auto;"
        viewBox="0 0 32 32"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
      >
        <g
          id="Page-1"
          stroke="none"
          stroke-width="1"
          fill="none"
          fill-rule="evenodd"
          sketch:type="MSPage"
        >
          <g
            id="icon-124-printer-text"
            sketch:type="MSArtboardGroup"
            fill="#000000"
          >
            <path
              d="M26,27 L28.0057181,27 C29.6594143,27 31,25.6556493 31,24.0005775 L31,14.9994225 C31,13.3428872 29.6594313,12 28.0057181,12 L26,12 L26,4.99961498 C26,3.89525812 25.1090746,3 24.0025781,3 L8.99742191,3 C7.89427625,3 7,3.88743329 7,4.99961498 L7,12 L7,12 L4.99428189,12 C3.34058566,12 2,13.3443507 2,14.9994225 L2,24.0005775 C2,25.6571128 3.3405687,27 4.99428189,27 L7,27 L7,28.000385 C7,29.1047419 7.89092539,30 8.99742191,30 L24.0025781,30 C25.1057238,30 26,29.1125667 26,28.000385 L26,27 L26,27 L26,27 Z M7,26 L5.00732994,26 C3.89833832,26 3,25.1033337 3,23.9972399 L3,15.0027601 C3,13.8935426 3.89871223,13 5.00732994,13 L27.9926701,13 C29.1016617,13 30,13.8966663 30,15.0027601 L30,23.9972399 C30,25.1064574 29.1012878,26 27.9926701,26 L26,26 L26,20 L7,20 L7,26 L7,26 L7,26 Z M8.9999602,4 C8.44769743,4 8,4.45303631 8,4.99703014 L8,12 L25,12 L25,4.99703014 C25,4.4463856 24.5452911,4 24.0000398,4 L8.9999602,4 L8.9999602,4 Z M8,21 L8,28.0029699 C8,28.5536144 8.45470893,29 8.9999602,29 L24.0000398,29 C24.5523026,29 25,28.5469637 25,28.0029699 L25,21 L8,21 L8,21 Z M25,17 C25.5522848,17 26,16.5522848 26,16 C26,15.4477152 25.5522848,15 25,15 C24.4477152,15 24,15.4477152 24,16 C24,16.5522848 24.4477152,17 25,17 L25,17 Z M9,23 L9,24 L24,24 L24,23 L9,23 L9,23 Z M9,26 L9,27 L24,27 L24,26 L9,26 L9,26 Z"
              id="printer-text"
              sketch:type="MSShapeGroup"
            ></path>
          </g>
        </g>
      </svg>
    </button>
  `,
})
export class PrinterButtomComponent implements OnInit {
  constructor(private _print: PrinterService) {}
  @Input() ITN: string;
  @Input() PRODUCTCODE: string;
  @Input() PARTNUMBER: string;
  public printer$;
  @Output() buttonClick: EventEmitter<null> = new EventEmitter();

  ngOnInit() {
    this.printer$ = of(false);
  }

  public onClick(): void {
    this.buttonClick.emit();
    if (this.ITN) {
      this.printer$ = this._print
        .printITN$(this.ITN, this.PRODUCTCODE, this.PARTNUMBER)
        .pipe(map(() => false));
    }
  }
}
