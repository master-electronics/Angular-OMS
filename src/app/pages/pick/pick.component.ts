import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FetchPrinterStationGQL } from 'src/app/graphql/qualityControl.graphql-gen';
import { CommonService } from 'src/app/shared/services/common.service';
import { PickService } from './pick.server';

@Component({
  selector: 'pick-order',
  templateUrl: './pick.component.html',
})
export class PickComponent implements OnInit {
  @ViewChild('stepPage') stepPage!: ElementRef;
  isModalVisible = false;
  modalMessage = '';
  printerStation$ = new Observable();
  title = 'Quality Control';

  constructor(
    private commonService: CommonService,
    private pickService: PickService,
    private fetchPrinterStation: FetchPrinterStationGQL
  ) {
    commonService.changeNavbar('Quality Control');
  }

  ngOnInit(): void {
    const station = this.commonService.printerInfo;
    if (!this.pickService.pickStartTime)
      this.pickService.resetPickStartTime(Date.now());
    if (station) return;
    this.printerStation$ = this.fetchPrinterStation.fetch().pipe(
      map((res) => {
        this.commonService.changeStation(res.data.fetchPrinterStation);
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
