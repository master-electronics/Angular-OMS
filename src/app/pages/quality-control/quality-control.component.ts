import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FetchPrinterStationGQL } from 'src/app/graphql/qualityControl.graphql-gen';
import { CommonService } from 'src/app/shared/services/common.service';
import { QualityControlService } from './quality-control.server';

@Component({
  selector: 'quality-control',
  templateUrl: './quality-control.component.html',
})
export class QualityControlComponent implements OnInit {
  @ViewChild('stepPage') stepPage!: ElementRef;
  isModalVisible = false;
  modalMessage = '';
  printerStation$ = new Observable();
  title = 'Quality Control';

  constructor(
    private commonService: CommonService,
    private qcService: QualityControlService,
    private fetchPrinterStation: FetchPrinterStationGQL
  ) {
    commonService.changeNavbar('Quality Control');
  }

  ngOnInit(): void {
    const station = this.commonService.printerStation;
    if (station) return;
    this.printerStation$ = this.fetchPrinterStation.fetch().pipe(
      map((res) => {
        this.commonService.changePrinterStation(res.data.fetchPrinterStation);
      }),
      catchError((error) => {
        this.modalMessage = error.error;
        this.isModalVisible = true;
        return of();
      })
    );
  }

  closeModal(): void {
    this.isModalVisible = false;
  }
}
