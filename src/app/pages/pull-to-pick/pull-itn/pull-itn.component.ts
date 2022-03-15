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
import { Observable } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import { catchError, map, tap } from 'rxjs/operators';
import { PickService } from '../pick.server';
import {
  FindNextItnForPullingGQL,
  UpdateAfterPullingGQL,
} from 'src/app/graphql/pick.graphql-gen';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'pull-itn',
  templateUrl: './pull-itn.component.html',
})
export class PullITNComponent implements OnInit, AfterViewInit {
  title = 'Pull ITN';
  isLoading = false;
  step = 'Location';
  alertType = 'error';
  alertMessage = '';
  init$ = new Observable();
  submit$ = new Observable();
  inputRegex = /^(\w{2}\d{8})|(\w{2}-\w{2}-\d{2}-\d{2}-[A-Z]-\d{2})$/;
  lastLocation = '';
  Location = '';
  ITN = '';
  OrderNumber: string;
  NOSINumber: string;
  inventoryID: number;

  inputForm = new FormGroup({
    barcodeInput: new FormControl('', [
      Validators.required,
      Validators.pattern(this.inputRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.inputForm.controls;
  }

  constructor(
    private _commonService: CommonService,
    private _router: Router,
    private _titleService: Title,
    private _pickService: PickService,
    private _findNextITN: FindNextItnForPullingGQL,
    private _updateAfterPulling: UpdateAfterPullingGQL
  ) {
    this._commonService.changeNavbar(this.title);
    this._titleService.setTitle('Pick a Cart');
  }

  @ViewChild('barcodeInput') barcodeInput!: ElementRef;
  ngOnInit(): void {
    this.lastLocation = this._pickService.lastLocation;
    if (!this.lastLocation) {
      this._router.navigate(['pulltopick/location']);
    }
    this.fetchNext();
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.barcodeInput.nativeElement.select();
    }, 10);
  }

  fetchNext(): void {
    this.init$ = this._findNextITN
      .fetch(
        {
          Zone: this._pickService.pickSettings.Zone,
          StrictPriority: this._pickService.pickSettings.StrictPriority,
          PriorityCutoff: this._pickService.pickSettings.PriorityCutoff,
          Barcode: this._pickService.lastLocation,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap(() => {
          //
        }),
        map((res) => {
          this.isLoading = false;
          this.inventoryID = res.data.findNextITNForPulling.InventoryID;
          this.ITN = res.data.findNextITNForPulling.InventoryTrackingNumber;
          this.Location = res.data.findNextITNForPulling.Barcode;
          this.OrderNumber = res.data.findNextITNForPulling.OrderNumber;
          this.NOSINumber = res.data.findNextITNForPulling.NOSINumber;
        }),
        catchError((err) => {
          this.alertMessage = err;
          this.alertType = 'error';
          this.isLoading = false;
          return [];
        })
      );
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.inputForm.valid || this.isLoading) {
      this.barcodeInput.nativeElement.select();
      return;
    }
    // verify input barcode
    const barcode = this.f.barcodeInput.value.replace(/-/g, '').trim();
    if (this.step === 'Location') {
      if (barcode === this.Location) {
        this.step = 'ITN';
        this.f.barcodeInput.reset();
        this.barcodeInput.nativeElement.select();
        return;
      } else {
        this.alertMessage = 'Invalid Location';
        this.alertType = 'error';
        this.barcodeInput.nativeElement.select();
        return;
      }
    }
    if (barcode !== this.ITN) {
      this.alertMessage = 'Invalid ITN';
      this.alertType = 'error';
      this.barcodeInput.nativeElement.select();
      return;
    }
    // Update Inventory
    this.step = 'Submit';
    this.isLoading = true;
    const UserID = Number(JSON.parse(sessionStorage.getItem('userInfo'))._id);
    this.submit$ = this._updateAfterPulling
      .mutate(
        {
          OrderLineDetail: {
            StatusID: environment.pickComplete_ID,
          },
          Inventory: {
            ContainerID: this._pickService.cartInfo.id,
          },
          InventoryID: this.inventoryID,
          log: [
            {
              UserEventID: environment.Event_Pulling_PullITN,
              InventoryTrackingNumber: this.ITN,
              UserID,
              OrderNumber: this.OrderNumber,
              NOSINumber: this.NOSINumber,
            },
          ],
        },
        { fetchPolicy: 'network-only' }
      )

      .pipe(
        map(() => {
          this.isLoading = false;
          this._pickService.changeLastLocation(this.Location);
          this.lastLocation = this.Location;
          this.step = 'Location';
          this.f.barcodeInput.reset();
          this.barcodeInput.nativeElement.select();
          this.fetchNext();
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
