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
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { NavbarTitleService } from '../../../shared/services/navbar-title.service';
import { CartBarcodeRegex } from '../../../shared/utils/dataRegex';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PickService } from '../pick.server';
import {
  FetchPickingSettingsGQL,
  VerifyCartAndUpdateForDropOffGQL,
  VerifyCartAndUpdateGQL,
} from 'src/app/graphql/pick.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Component({
  selector: 'select-cart',
  templateUrl: './select-cart.component.html',
})
export class SelectCartComponent implements OnInit, AfterViewInit {
  title = 'Select a cart';
  isLoading = true;
  alertType = 'error';
  alertMessage = '';
  submit$ = new Observable();
  init$ = new Observable();
  userID: number;
  urlParams;

  containerForm = new FormGroup({
    containerNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(CartBarcodeRegex),
    ]),
  });
  get f(): { [key: string]: AbstractControl } {
    return this.containerForm.controls;
  }

  constructor(
    private _title: NavbarTitleService,
    private _titleService: Title,
    private _router: Router,
    private _route: ActivatedRoute,
    private _verifyCart: VerifyCartAndUpdateGQL,
    private _verifyCartForDropOff: VerifyCartAndUpdateForDropOffGQL,
    private _pickService: PickService,
    private _fetchSettings: FetchPickingSettingsGQL,
    private _userLog: Insert_UserEventLogsGQL,
    private _userInfo: StorageUserInfoService
  ) {
    this._title.update(this.title);
    this._titleService.setTitle(this.title);
  }

  @ViewChild('containerNumber') containerInput!: ElementRef;
  ngOnInit(): void {
    this.alertType = this._route.snapshot.queryParams['type'];
    this.alertMessage = this._route.snapshot.queryParams['message'];
    this.urlParams = { ...this._route.snapshot.queryParams };
    this.userID = this._userInfo.idToken;
    this.init$ = this._fetchSettings
      .fetch(
        {
          UserInfo: {
            _id: this.userID,
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          //if (res.data.findUserInfo.Zone === null)
          //throw 'User has no zone assigned!';

          if (res.data.findUserInfo.StrictPriority === null)
            throw 'User has no Strict Priority assigned!';

          if (res.data.findUserInfo.PriorityCutoff === null)
            throw 'User has no Priority lvl assigned!';
        }),
        map((res) => {
          this.isLoading = false;
          this._pickService.changePickSettings({
            Zone: 1, //res.data.findUserInfo.Zone,
            StrictPriority: res.data.findUserInfo.StrictPriority,
            PriorityCutoff: res.data.findUserInfo.PriorityCutoff,
          });
        }),
        catchError((err) => {
          this.alertMessage = err;
          this.alertType = 'error';
          return err;
        })
      );
  }
  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.containerForm.valid || this.isLoading) {
      this.containerInput.nativeElement.select();
      return;
    }
    this.isLoading = true;
    this.urlParams.dropoff === 'true' ? this.forDropoff() : this.forPulling();
  }

  forPulling(): void {
    this.submit$ = this._verifyCart
      .mutate(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode: this.containerForm.value.containerNumber,
          },
          UserID: this.userID,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        switchMap((res) => {
          this._pickService.changeCartInfo({
            id: res.data.updateUserCart._id,
            barcode: this.containerForm.value.containerNumber,
          });
          return this._userLog.mutate({
            log: [
              {
                Message: `${this.containerForm.value.containerNumber}`,
                UserEventID: sqlData.Event_Pulling_SelectCart,
                UserName: this._userInfo.userName,
              },
            ],
          });
        }),
        map(() => {
          this.isLoading = false;
          this._router.navigate(['pulltopick/location']);
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

  forDropoff(): void {
    this.submit$ = this._verifyCartForDropOff
      .mutate(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode: this.containerForm.value.containerNumber,
          },
          UserID: this.userID,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        switchMap((res) => {
          this._pickService.changeCartInfo({
            id: res.data.updateUserCartForDropOff._id,
            barcode: this.containerForm.value.containerNumber,
          });
          return this._userLog.mutate({
            log: [
              {
                Message: `${this.containerForm.value.containerNumber}`,
                UserEventID: sqlData.Event_DropOff_SelectCart,
                UserName: this._userInfo.userName,
              },
            ],
          });
        }),
        map(() => {
          this.isLoading = false;
          this._router.navigate(['pulltopick/dropoff']);
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
}
