import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, of, startWith } from 'rxjs';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { HDIService } from 'src/app/shared/data/hdi';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { sqlData } from 'src/app/shared/utils/sqlData';
import { QualityControlService } from './quality-control.server';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, SubmitButtonComponent],
  template: `
    <h1 class="flex justify-center text-xl font-bold lg:text-4xl">
      Put Item on the scale
    </h1>
    <h1 class="text-xl font-bold lg:text-3xl">
      Weight: {{ weight$ | async }} {{ this.HDI.unit() }}
    </h1>
    <div class="h-16 w-32 justify-center">
      <submit-button
        (buttonClick)="onSubmit()"
        [disabled]="isvaild$ | async"
        [loading]="this.data$ | async"
      ></submit-button>
    </div>
  `,
})
export class LogWeightComponent {
  weight$ = toObservable(this.HDI.weight).pipe(
    debounceTime(500),
    distinctUntilChanged()
  );
  data$;
  isvaild$ = this.weight$.pipe(
    startWith(0),
    map((weight) => weight <= 0)
  );
  constructor(
    private _router: Router,
    private _userInfo: StorageUserInfoService,
    private qcServer: QualityControlService,
    private logService: EventLogService,
    private eventLog: Create_EventLogsGQL,
    public HDI: HDIService
  ) {}

  onSubmit(): void {
    if (!this.HDI.weight()) {
      return;
    }
    const oldLogs = [
      {
        UserName: this._userInfo.userName,
        UserEventID: sqlData.Event_QC_WeightScale,
        OrderNumber: this.qcServer.itemInfo.OrderNumber,
        NOSINumber: this.qcServer.itemInfo.NOSI,
        InventoryTrackingNumber: this.qcServer.itemInfo.InventoryTrackingNumber,
        OrderLineNumber: this.qcServer.itemInfo.OrderLineNumber,
        CustomerNumber: this.qcServer.itemInfo.CustomerNumber,
        CustomerTier: this.qcServer.itemInfo.CustomerTier,
        DistributionCenter: this.qcServer.itemInfo.DistributionCenter,
        PartNumber: this.qcServer.itemInfo.PartNumber,
        ProductCode: this.qcServer.itemInfo.ProductCode,
        ProductTier: this.qcServer.itemInfo.ProductTier,
        Quantity: this.qcServer.itemInfo.Quantity,
        ParentITN: this.qcServer.itemInfo.ParentITN,
        ShipmentMethod: this.qcServer.itemInfo.ShipmentMethod,
        ShipmentMethodDescription:
          this.qcServer.itemInfo.ShipmentMethodDescription,
        WMSPriority: this.qcServer.itemInfo.WMSPriority,
        Priority: this.qcServer.itemInfo.Priority,
        Message: `${this.HDI.weight()} ${this.HDI.unit()}`,
      },
    ];
    const eventLogs = [
      {
        ...this.logService.eventLog,
        EventTypeID: sqlData.Event_QC_WeightScale,
        Log: JSON.stringify({
          ...JSON.parse(this.logService.eventLog.Log),
          Weight: this.HDI.weight(),
          Unit: this.HDI.unit(),
        }),
      },
    ];
    this.data$ = this.eventLog
      .mutate({
        oldLogs,
        eventLogs,
      })
      .pipe(
        map(() => {
          this._router.navigate(['/qc']);
        })
      );
  }
}
