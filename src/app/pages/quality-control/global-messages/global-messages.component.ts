import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { QualityControlService } from '../quality-control.server';
import {
  QcGlobalMessageGQL,
  QcGlobalMessageQueryVariables,
} from '../../../graphql/qualityControl.graphql-gen';
import { Title } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

@Component({
  selector: 'global-messages',
  templateUrl: './global-messages.component.html',
  standalone: true,
  imports: [
    NgIf,
    NzSkeletonModule,
    NzDescriptionsModule,
    NgFor,
    NzGridModule,
    NzFormModule,
    NzButtonModule,
    NzWaveModule,
    NzAlertModule,
    AsyncPipe,
  ],
})
export class GlobalMessagesComponent implements OnInit {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  globalMessage$ = new Observable();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private qcService: QualityControlService,
    private qcGlobalMessage: QcGlobalMessageGQL
  ) {
    this.titleService.setTitle('qc/globalmessages');
  }

  ngOnInit(): void {
    const {
      CustomerNumber,
      DistributionCenter,
      OrderNumber,
      OrderLineNumber,
      PartNumber,
      ProductCode,
    } = this.qcService.itemInfo;
    if (!DistributionCenter) {
      this.router.navigate(['qc']);
    }
    this.qcService.changeTab(['finish', 'process', 'wait', 'wait']);
    const params: QcGlobalMessageQueryVariables = {
      CustomerNumber,
      DistributionCenter,
      OrderNumber,
      OrderLineNumber: OrderLineNumber.toString(),
      PartNumber,
      ProductCode,
    };
    this.getGlobalMessage(params);
  }

  onSubmit(): void {
    this.router.navigate(['/qc/verifypack'], {
      queryParams: this.route.snapshot.queryParams,
    });
  }

  orderComments = [];
  partComments = [];
  getGlobalMessage(params: QcGlobalMessageQueryVariables): void {
    this.isLoading = true;
    this.globalMessage$ = this.qcGlobalMessage
      .fetch(params, { fetchPolicy: 'no-cache' })
      .pipe(
        map((res) => {
          this.orderComments = res.data.fetchOrderLineMessage.comments;
          this.partComments = res.data.fetchPartMessage.comments;
          if (
            this.orderComments.length === 0 &&
            this.partComments.length === 0
          ) {
            this.onSubmit();
          } else {
            this.qcService.changeGlobalMessages(res.data);
          }
          this.isLoading = res.loading;
        }),
        catchError((error) => {
          this.isLoading = false;
          this.alertType = 'error';
          this.alertMessage = error;
          return error(error);
        })
      );
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }

  ngOnDestroy(): void {
    //
  }
}
