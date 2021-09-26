import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { QualityControlService } from '../quality-control.server';
import { QcGlobalMessageGQL } from '../../../graphql/qualityControl.graphql-gen';
import { Title } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';

interface globalMessageParams {
  PartNumber: string;
  ProductCode: string;
  CustomerNumber: string;
  DistributionCenter: string;
  OrderNumber: string;
  OrderLineNumber: string;
}

@Component({
  selector: 'global-messages',
  templateUrl: './global-messages.component.html',
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
    this.qcService.changeTab(['finish', 'process', 'wait', 'wait']);
    const urlParams = this.route.snapshot.queryParams;
    const params: globalMessageParams = {
      CustomerNumber: urlParams['CustomerNum'],
      DistributionCenter: urlParams['DC'],
      OrderNumber: urlParams['OrderNum'],
      OrderLineNumber: urlParams['OrderLine'],
      PartNumber: urlParams['PartNum'],
      ProductCode: urlParams['PRC'],
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
  getGlobalMessage(params: globalMessageParams): void {
    this.isLoading = true;
    this.globalMessage$ = this.qcGlobalMessage
      .watch(params, { fetchPolicy: 'no-cache' })
      .valueChanges.pipe(
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
          return throwError(error);
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
