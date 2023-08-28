import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { QualityControlService } from './quality-control.server';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';
import { PrinterService } from 'src/app/shared/data/printer';

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
    private _printer: PrinterService
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
