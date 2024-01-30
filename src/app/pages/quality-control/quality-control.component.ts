import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';
import { PrinterService } from 'src/app/shared/data/printer';
import { HDIService } from 'src/app/shared/data/hdi';

@Component({
  selector: 'quality-control',
  templateUrl: './quality-control.component.html',
})
export class QualityControlComponent implements OnInit {
  @ViewChild('stepPage') stepPage!: ElementRef;
  isModalVisible = false;
  modalMessage = '';
  printerStation$;
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
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
