import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { APIService } from 'src/app/shared/services/API.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { QualityControlService } from './quality-control.server';

interface printerInfo {
  ipAddress: string;
  packerPrinter: string;
}

@Component({
  selector: 'quality-control',
  templateUrl: './quality-control.component.html',
})
export class QualityControlComponent implements OnInit {
  @ViewChild('stepPage') stepPage;
  isModalHidden = true;
  modalMessage: string;
  printerInfo: printerInfo;
  title = 'Quality Control';
  constructor(
    private commonService: CommonService,
    private titleService: Title,
    private apiService: APIService,
    private qcService: QualityControlService
  ) {
    this.commonService.changeTitle(this.title);
    this.titleService.setTitle('Quality Control');
  }
  ngOnInit(): void {
    this.apiService.onCheckQCPrinter().subscribe(
      (data: any) => {
        if (data.Status.StatusCode !== '200') {
          this.isModalHidden = false;
        } else {
          this.printerInfo = {
            ipAddress: data.LABSTA[0].ID,
            packerPrinter: data.LABSTA[0].PackerPrinter,
          };
          if (data.LABSTA[0].StationID) {
            this.qcService.changeStation(
              data.LABSTA[0].StationID.padStart(2, '0')
            );
          } else {
            this.modalMessage = `Can't find QC station!`;
            this.isModalHidden = false;
          }
        }
      },
      () => {
        this.modalMessage = `Can't find QC printer's configuration!`;
        this.isModalHidden = false;
      }
    );
  }
  toggleModal(): void {
    this.isModalHidden = !this.isModalHidden;
  }
}
