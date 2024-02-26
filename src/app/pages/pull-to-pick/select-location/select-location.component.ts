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
import { forkJoin, Observable } from 'rxjs';

import { NavbarTitleService } from '../../../shared/services/navbar-title.service';
import { ShelfBarcodeBarcodeRegex } from '../../../shared/utils/dataRegex';
import { catchError, map, tap } from 'rxjs/operators';
import { PickService } from '../pick.server';
import { VerifyPositionBarcodeForPullingGQL } from 'src/app/graphql/pick.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
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
  selector: 'select-location',
  templateUrl: './select-location.component.html',
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
    private _title: NavbarTitleService,
    private _router: Router,
    private _userInfo: StorageUserInfoService,
    private _titleService: Title,
    private _pickService: PickService,
    private _verifyPosition: VerifyPositionBarcodeForPullingGQL,
    private _insertLog: Insert_UserEventLogsGQL
  ) {
    this._title.update(this.title);
    this._titleService.setTitle(this.title);
  }

  @ViewChild('positionNumber') positionInput!: ElementRef;
  ngAfterViewInit(): void {
    this.positionInput.nativeElement.select();
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
        UserName: this._userInfo.userName,
      },
    ];
    this.isLoading = true;
    this.submit$ = forkJoin({
      verifyPosition: this._verifyPosition.fetch(
        {
          Container: {
            DistributionCenter: this._userInfo.distributionCenter,
            Barcode,
          },
        },
        { fetchPolicy: 'network-only' }
      ),
      insertLog: this._insertLog.mutate({ log }, { fetchPolicy: 'no-cache' }),
    }).pipe(
      tap((res) => {
        const position = res.verifyPosition.data.findContainer;
        if (!position?._id) throw 'Cart not found!';
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
