import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  FindContainerGQL,
  FindItNsInCartForDropOffGQL,
  UpdateAfterDropOffGQL,
} from 'src/app/graphql/pick.graphql-gen';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { CommonService } from 'src/app/shared/services/common.service';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { environment } from 'src/environments/environment';
import { PickService } from '../pick.server';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { FocusInvlidInputDirective } from '../../../shared/directives/focusInvalidInput.directive';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';

@Component({
  selector: 'drop-off',
  templateUrl: './drop-off.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    NzFormModule,
    FocusInvlidInputDirective,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzAlertModule,
    NzTableModule,
    NgFor,
    AsyncPipe,
  ],
})
export class DropOffComponent implements OnInit, AfterViewInit {
  title = 'Drop Off';
  process = 'Submit';
  hint = 'Scan Drop off position';
  alertType = 'error';
  cartBarcode: string;
  locationBarcode: string;
  dropOffID: number;
  isLoading = false;
  alertMessage = '';
  totalITNs = 0;
  itemList = [];
  selectedList = [];
  isShowDetail = false;
  submit$ = new Observable();
  scanLocation$ = new Observable();
  inputRegex = /^(QADROP[0-9]{2})|(\w{2}\d{8})$/;
  init$ = new Observable();
  insertLog$ = new Observable();

  containerForm = this._fb.group({
    containerNumber: [
      '',
      [Validators.required, Validators.pattern(this.inputRegex)],
    ],
  });

  constructor(
    private _commonService: CommonService,
    private _titleService: Title,
    private _fb: FormBuilder,
    private _router: Router,
    private _service: PickService,
    private _findITNs: FindItNsInCartForDropOffGQL,
    private _updateForDropOff: UpdateAfterDropOffGQL,
    private _findContainer: FindContainerGQL,
    private _insertLog: Insert_UserEventLogsGQL,
    private _userInfo: StorageUserInfoService
  ) {
    this._commonService.changeNavbar(this.title);
    this._titleService.setTitle(this.title);
  }

  @ViewChild('containerNumber') containerInput: ElementRef;
  ngOnInit(): void {
    if (!this._service.cartInfo) {
      this._router.navigate(['pulltopick'], { queryParams: { DropAll: true } });
      return;
    }
    this.cartBarcode = this._service.cartInfo.barcode;
    if (this._service.isSupr) {
      this.isShowDetail = true;
      this._service.changeisSupr(false);
    }
    this.init$ = forkJoin({
      findITNs: this._findITNs.fetch(
        {
          ContainerID: this._service.cartInfo.id,
        },
        { fetchPolicy: 'network-only' }
      ),
      insertUserLog: this._insertLog.mutate({
        log: {
          UserName: this._userInfo.userName,
          UserEventID: sqlData.Event_DropOff_Start,
          Message: `From ${this._service.cartInfo.barcode}`,
        },
      }),
    }).pipe(
      tap((res) => {
        if (res.findITNs.data.findInventorys.length === 0)
          throw 'Not found any ITN in the cart';
        if (
          res.findITNs.data.findInventorys.some(
            (item) => !item.ORDERLINEDETAILs
          )
        )
          throw 'Not found Order in the cart';
      }),
      map((res) => {
        res.findITNs.data.findInventorys.forEach((node) => {
          this.itemList.push(node);
          this.totalITNs += 1;
        });
        return true;
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
    if (!this.containerForm.valid) {
      this.containerInput.nativeElement.select();
      return;
    }
    if (this.process === 'Scan ITN') {
      this.selectITN();
      return;
    }
    // verify container
    this.scanLocation();
  }

  selectITN(): void {
    let count = 0;
    this.itemList = this.itemList.filter((node) => {
      const isEqual =
        node.InventoryTrackingNumber ===
        this.containerForm.get('containerNumber').value;
      if (isEqual) {
        this.selectedList.unshift(node);
        count += 1;
        this.isLoading = true;
        this.insertLog$ = this._insertLog
          .mutate({
            log: {
              InventoryTrackingNumber: node.InventoryTrackingNumber,
              OrderNumber: node.ORDERLINEDETAILs[0].Order.OrderNumber,
              NOSINumber: node.ORDERLINEDETAILs[0].Order.NOSINumber,
              UserEventID: sqlData.Event_DropOff_ITN_Drop,
              UserName: this._userInfo.userName,
              Message: `From ${this._service.cartInfo.barcode}`,
            },
          })
          .pipe(map(() => (this.isLoading = false)));
      }
      return !isEqual;
    });
    if (this.totalITNs === this.selectedList.length) {
      this.process = 'Complete';
      const log = [];
      this.selectedList.forEach((node) => {
        log.push({
          InventoryTrackingNumber: node.InventoryTrackingNumber,
          OrderNumber: node.ORDERLINEDETAILs[0].Order.OrderNumber,
          NOSINumber: node.ORDERLINEDETAILs[0].Order.NOSINumber,
          UserEventID: sqlData.Event_DropOff_Done,
          UserName: this._userInfo.userName,
          Message: `From ${this._service.cartInfo.barcode}`,
        });
      });
      this.isLoading = true;
      this.submit$ = this._updateForDropOff
        .mutate(
          {
            UserID: this._userInfo.idToken,
            UserInfo: {
              CartID: null,
            },
            Inventory: {
              ContainerID: this.dropOffID,
            },
            ContainerID: this._service.cartInfo.id,
            log,
          },
          { fetchPolicy: 'network-only' }
        )
        .pipe(
          map(() => {
            this._router.navigate(['pulltopick'], {
              queryParams: {
                type: 'success',
                message: `Drop off in ${
                  this.containerForm.get('containerNumber').value
                } is successful.`,
              },
            });
          }),
          catchError((err) => {
            this.alertMessage = err;
            this.alertType = 'error';
            return err;
          })
        );
    } else if (count === 0) {
      this.alertMessage = `ITN is not in the list.`;
    }

    this.containerForm.reset({
      containerNumber: '',
    });
    this.containerInput.nativeElement.select();
    return;
  }

  scanLocation(): void {
    this.isLoading = true;
    this.scanLocation$ = this._findContainer
      .fetch(
        {
          Container: {
            DistributionCenter: environment.DistributionCenter,
            Barcode: this.containerForm
              .get('containerNumber')
              .value.replace(/-/g, '')
              .trim(),
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findContainer._id) {
            throw 'Drop off location not found';
          }
        }),
        map((res) => {
          this.isLoading = false;
          this.dropOffID = res.data.findContainer._id;
          this.process = 'Scan ITN';
          this.hint = 'Scan ITNs in the cart';
          this.locationBarcode = this.containerForm.value.containerNumber;
          this.containerForm.get('containerNumber').reset();
          this.containerInput.nativeElement.select();
        }),
        catchError((err) => {
          this.isLoading = false;
          this.alertMessage = err;
          this.alertType = 'error';
          return err;
        })
      );
  }

  auth(): void {
    this._router.navigate(['pulltopick/detailauth']);
  }
}
