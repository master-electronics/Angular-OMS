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
import { of, Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import { ITNBarcodeRegex } from '../../shared/dataRegex';
import {
  FetchPrinterStationGQL,
  PrintItnLabelGQL,
} from '../../graphql/qualityControl.graphql-gen';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'print-itn',
  templateUrl: './print-itn.component.html',
})
export class PrintITNComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Print ITN';
  isModalHidden = true;
  modalMessage: string;
  station$;
  isLoading = false;
  messageType = 'error';
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
    private fetchPrinterStation: FetchPrinterStationGQL
  ) {
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle('printITN');
  }

  @ViewChild('ITNInput') ITNInput: ElementRef;
  ngOnInit(): void {
    this.currentStation = this.commonService.printerInfo;
    if (this.currentStation) return;
    this.station$ = this.fetchPrinterStation.fetch().pipe(
      map((res) => {
        this.currentStation = res.data.fetchPrinterStation;
        this.commonService.changeStation(this.currentStation);
      }),
      catchError((error) => {
        this.modalMessage = error.error;
        this.isModalHidden = false;
        return of();
      })
    );
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
        .mutate({
          InternalTrackingNumber: this.ITNForm.get('ITN').value,
          Station: this.currentStation,
        })
        .subscribe(
          (res) => {
            this.messageType = 'success';
            this.message = 'Print success.';
            if (!res.data.printITNLabel.success) {
              this.messageType = 'error';
              this.message = res.data.printITNLabel.message;
            }
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
