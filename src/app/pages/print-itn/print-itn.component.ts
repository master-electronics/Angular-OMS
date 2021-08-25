import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import { ITNBarcodeRegex } from '../../shared/dataRegex';
import { PrintItnLabelGQL } from '../../graphql/forQualityControl.graphql-gen';
import { APIService } from 'src/app/shared/services/API.service';

@Component({
  selector: 'print-itn',
  templateUrl: './print-itn.component.html',
})
export class PrintITNComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Print ITN';
  isModalHidden = true;
  modalMessage: string;
  isLoading = false;
  messageType = 'error';
  buttonStyles = 'bg-indigo-800';
  message = '';
  currentStation: string;

  ITNForm = new FormGroup({
    ITN: new FormControl('', [
      Validators.required,
      Validators.pattern(ITNBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.ITNForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private titleService: Title,
    private printItnLabel: PrintItnLabelGQL,
    private apiService: APIService
  ) {
    this.commonService.changeTitle(this.title);
    this.titleService.setTitle('Aggregation In');
  }

  @ViewChild('ITNInput') ITNInput: ElementRef;
  async ngOnInit(): Promise<void> {
    this.currentStation = this.commonService.stationInfo;
    if (this.currentStation === '') {
      try {
        const data$: any = await this.apiService.onCheckQCPrinter().toPromise();
        if (data$.Status.StatusCode !== '200') {
          this.isModalHidden = false;
        } else {
          if (data$.LABSTA[0].StationID) {
            this.commonService.changeStation(data$.LABSTA[0].StationID.trim());
          } else {
            this.modalMessage = `Station number not found in configuration!`;
            this.isModalHidden = false;
          }
        }
      } catch (error) {
        this.modalMessage = error.error;
        this.isModalHidden = false;
      }
    }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.ITNInput.nativeElement.select();
    }, 10);
  }

  onSubmit(): void {
    this.message = '';
    if (this.ITNForm.valid) {
      this.printITN();
    }
  }

  printITN(): void {
    this.isLoading = true;
    this.subscription.add(
      this.printItnLabel
        .watch(
          {
            InternalTrackingNumber: this.ITNForm.get('ITN').value,
            Station: this.currentStation,
          },
          { fetchPolicy: 'no-cache' }
        )
        .valueChanges.subscribe(
          (res) => {
            if (!res.data.printITNLabel.success) {
              this.messageType = 'error';
              this.message = res.data.printITNLabel.message;
              return;
            }
            this.messageType = 'success';
            this.message = 'Print success.';
            this.isLoading = false;
          },
          (error) => {
            this.message = error;
            this.messageType = 'error';
            this.isLoading = false;
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
