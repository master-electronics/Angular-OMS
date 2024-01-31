import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';
import { PrinterService } from 'src/app/shared/data/printer';
import { HDIService } from 'src/app/shared/data/hdi';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'quality-control',
  templateUrl: './quality-control.component.html',
})
export class QualityControlComponent implements OnInit {
  @ViewChild('stepPage') stepPage!: ElementRef;
  isModalVisible = false;
  isWeightScale = false;
  modalMessage = '';
  printerStation$;
  weight$;
  title = 'Quality Control';

  constructor(
    private _title: NavbarTitleService,
    private _printer: PrinterService,
    public hdi: HDIService
  ) {
    this._title.update('Quality Control');
  }

  ngOnInit(): void {
    this.printerStation$ = this._printer.printerStation$;
    this.weight$ = this.hdi.checkWeightScaleConfig$().pipe(
      catchError((error) => {
        return of(false);
      })
    );
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  connect(): void {
    this.hdi.connectHID();
  }
}
