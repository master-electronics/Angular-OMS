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
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NavbarTitleService } from '../../../shared/services/navbar-title.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { PickService } from '../pick.server';
import {
  FindNextItnForPullingGQL,
  UpdateAfterPullingGQL,
  UpdatePullingNotFoundGQL,
  VerifyCartAndUpdateGQL,
} from 'src/app/graphql/pick.graphql-gen';
import { environment } from 'src/environments/environment';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NgIf, AsyncPipe } from '@angular/common';
import { FocusInvlidInputDirective } from '../../../shared/directives/focusInvalidInput.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Component({
  selector: 'pull-itn',
  templateUrl: './pull-itn.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    FocusInvlidInputDirective,
    ReactiveFormsModule,
    NgIf,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzAlertModule,
    AsyncPipe,
  ],
})
export class PullITNComponent implements OnInit, AfterViewInit {
  title = 'Pull ITN';
  isLoading = false;
  step = 'Location';
  alertType = 'error';
  alertMessage = '';
  init$ = new Observable();
  submit$ = new Observable();
  notFound$ = new Observable();
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
    private _title: NavbarTitleService,
    private _router: Router,
    private _titleService: Title,
    private _pickService: PickService,
    private _findNextITN: FindNextItnForPullingGQL,
    private _updateAfterPulling: UpdateAfterPullingGQL,
    private _updateUserCart: VerifyCartAndUpdateGQL,
    private _updateNotFound: UpdatePullingNotFoundGQL,
    private _userInfo: StorageUserInfoService
  ) {
    this._title.update(this.title);
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
    this.barcodeInput.nativeElement.select();
  }

  fetchNext(): void {
    this.isLoading = true;
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
        tap((res) => {
          if (res.data.findNextITNForPulling === null) {
            throw 'No pick order found';
          }
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
    const UserID = this._userInfo.idToken;
    this.submit$ = this._updateUserCart
      .mutate(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode: this._pickService.cartInfo.barcode,
          },
          UserID,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        switchMap(() => {
          return this._updateAfterPulling.mutate(
            {
              OrderLineDetail: {
                StatusID: sqlData.pickComplete_ID,
              },
              Inventory: {
                ContainerID: this._pickService.cartInfo.id,
              },
              InventoryID: this.inventoryID,
              log: [
                {
                  UserEventID: sqlData.Event_Pulling_PullITN,
                  InventoryTrackingNumber: this.ITN,
                  UserName: this._userInfo.userName,
                  OrderNumber: this.OrderNumber,
                  NOSINumber: this.NOSINumber,
                },
              ],
            },
            { fetchPolicy: 'network-only' }
          );
        }),
        map(() => {
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

  notFound(): void {
    this.isLoading = true;
    this.notFound$ = this._updateNotFound
      .mutate(
        {
          InventoryID: this.inventoryID,
          OrderLineDetail: {
            StatusID: sqlData.notFound_ID,
          },
          log: [
            {
              UserEventID: sqlData.Event_Pulling_NotFound,
              InventoryTrackingNumber: this.ITN,
              UserName: this._userInfo.userName,
              OrderNumber: this.OrderNumber,
              NOSINumber: this.NOSINumber,
            },
          ],
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map(() => {
          this.step = 'Location';
          this.f.barcodeInput.reset();
          this.barcodeInput.nativeElement.select();
          this.alertType = 'warning';
          this.alertMessage = `${this.ITN} not found`;
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
