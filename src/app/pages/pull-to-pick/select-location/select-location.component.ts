import {
  Component,
  OnInit,
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
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import { ShelfBarcodeBarcodeRegex } from '../../../shared/dataRegex';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PickService } from '../pick.server';
import { VerifyPositionBarcodeForPullingGQL } from 'src/app/graphql/pick.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/sqlData';

@Component({
  selector: 'select-location',
  templateUrl: './select-location.component.html',
})
export class SelectLocationComponent implements OnInit, AfterViewInit {
  title = 'Position';
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  submit$ = new Observable();
  init$ = new Observable();

  positionForm = new FormGroup({
    positionNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(ShelfBarcodeBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.positionForm.controls;
  }

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private _titleService: Title,
    private _pickService: PickService,
    private _verifyPosition: VerifyPositionBarcodeForPullingGQL,
    private _insertLog: Insert_UserEventLogsGQL
  ) {
    this._commonService.changeNavbar(this.title);
    this._titleService.setTitle(this.title);
  }

  @ViewChild('positionNumber') positionInput!: ElementRef;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.positionInput.nativeElement.select();
    }, 10);
  }

  ngOnInit(): void {
    if (!this._pickService.pickSettings) {
      this._router.navigate(['pulltopick']);
    }
  }

  onSubmit(): void {
    this.alertMessage = '';
    this.alertMessage = '';
    if (!this.positionForm.valid || this.isLoading) {
      return;
    }
    const barcodeInput = this.f.positionNumber.value;
    const Barcode = barcodeInput.replace(/-/g, '');
    if (!this.positionForm.valid || this.isLoading) {
      this.positionInput.nativeElement.select();
      return;
    }
    const log = [
      {
        Message: `${this.f.positionNumber.value}`,
        UserEventID: sqlData.Event_Pulling_SelectLocation,
        UserID: Number(JSON.parse(sessionStorage.getItem('userInfo'))._id),
      },
    ];
    this.isLoading = true;
    this.submit$ = forkJoin({
      verifyPosition: this._verifyPosition.fetch(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode,
          },
        },
        { fetchPolicy: 'network-only' }
      ),
      insertLog: this._insertLog.mutate({ log }, { fetchPolicy: 'no-cache' }),
    }).pipe(
      tap((res) => {
        const position = res.verifyPosition.data.findContainer;
        if (!position?.length) throw 'Cart not found!';
      }),
      map(() => {
        this.isLoading = false;
        this._pickService.changeLastLocation(Barcode);
        this._router.navigate(['/pulltopick/pullitn']);
        return true;
      }),
      catchError((err) => {
        this.alertMessage = err;
        this.alertType = 'error';
        this.isLoading = false;
        return [];
      })
    );
  }

  dropOff(): void {
    this._router.navigate(['pulltopick/dropoff']);
  }
}
