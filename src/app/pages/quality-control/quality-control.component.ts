import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APIService } from 'src/app/shared/services/API.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { QualityControlService } from './quality-control.server';

@Component({
  selector: 'quality-control',
  templateUrl: './quality-control.component.html',
})
export class QualityControlComponent implements OnInit {
  @ViewChild('stepPage') stepPage: ElementRef;
  isModalHidden = true;
  modalMessage: string;
  title = 'Quality Control';

  constructor(
    private commonService: CommonService,
    private titleService: Title,
    private qcService: QualityControlService,
    private apiService: APIService
  ) {
    this.commonService.changeTitle(this.title);
    this.titleService.setTitle('Quality Control');
  }

  async ngOnInit(): Promise<void> {
    const station = this.commonService.stationInfo;
    if (!this.qcService.qcStart) this.qcService.resetQCStartTime(Date.now());
    if (station === '') {
      this.apiService.checkQCPrinter$.subscribe(
        (res: any) => {
          if (res.Status.StatusCode !== '200') {
            this.isModalHidden = false;
          } else {
            if (res.LABSTA[0].StationID) {
              this.commonService.changeStation(res.LABSTA[0].StationID.trim());
            } else {
              this.modalMessage = `Station number not found in configuration!`;
              this.isModalHidden = false;
            }
          }
        },
        (error) => {
          this.modalMessage = error.error;
          this.isModalHidden = false;
        }
      );
    }
  }
  toggleModal(): void {
    this.isModalHidden = !this.isModalHidden;
  }
}
