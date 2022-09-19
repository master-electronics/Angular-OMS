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
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { of, Subscription, throwError } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import { ITNBarcodeRegex } from '../../shared/dataRegex';
import {
  FetchPrinterStationGQL,
  PrintItnLabelGQL,
} from '../../graphql/qualityControl.graphql-gen';
import { catchError, map, tap } from 'rxjs/operators';

@Component({
  selector: 'print-itn',
  templateUrl: './print-itn.component.html',
})
export class PrintITNComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Print ITN';
  isModalVisible = false;
  modalMessage: string;
  printerStation$;
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  currentStation: string;

  ITNForm = new UntypedFormGroup({
    ITN: new UntypedFormControl('', [
      Validators.required,
      Validators.pattern(ITNBarcodeRegex),
    ]),
  });

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private titleService: Title,
    private printItnLabel: PrintItnLabelGQL,
    private fetchPrinterStation: FetchPrinterStationGQL
  ) {
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle('printITN');
  }

  ngOnInit(): void {
    this.currentStation = this.commonService.printerStation;
    if (this.currentStation) return;
    this.printerStation$ = this.fetchPrinterStation.fetch().pipe(
      map((res) => {
        this.currentStation = res.data.fetchPrinterStation;
        this.commonService.changePrinterStation(this.currentStation);
      }),
      catchError((error) => {
        this.modalMessage = error.error;
        this.isModalVisible = true;
        return of();
      })
    );
  }
  @ViewChild('ITN') ITNInput!: ElementRef;
  ngAfterViewInit(): void {
    this.ITNInput.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (this.ITNForm.valid) {
      this.printITN();
    }
  }

  printITN(): void {
    this.isLoading = true;
    this.subscription.add(
      this.printItnLabel
        .mutate({
          InventoryTrackingNumber: this.ITNForm.get('ITN').value.toUpperCase(),
          Station: this.currentStation,
        })
        .pipe(
          tap((res) => {
            if (!res.data.printITNLabel.success) {
              throw res.data.printITNLabel.message;
            }
            this.isLoading = false;
            this.alertType = 'success';
            this.alertMessage = 'Print ITN label success.';
          }),
          catchError((error) => {
            this.alertMessage = error;
            this.alertType = 'error';
            this.isLoading = false;
            return throwError(error);
          })
        )
        .subscribe()
    );
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
