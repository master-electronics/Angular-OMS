import {
  AfterViewInit,
  Component,
  HostListener,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { QualityControlService } from '../quality-control.server';
import { QcGlobalMessageGQL } from '../../../graphql/forQualityControl.graphql-gen';
import { ShortcutInput } from 'ng-keyboard-shortcuts';
import { Title } from '@angular/platform-browser';

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
export class GlobalMessagesComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  isLoading = false;
  messageType = 'error';
  message = '';
  orderComments: string[];
  partComments: string[];
  private subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private qcService: QualityControlService,
    private qcGlobalMessage: QcGlobalMessageGQL
  ) {
    titleService.setTitle('qc/globalmessages');
  }

  gmForm = this.fb.group({});

  ngOnInit(): void {
    this.qcService.changeTab(2);
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

  getGlobalMessage(params: globalMessageParams): void {
    this.isLoading = true;
    this.subscription.add(
      this.qcGlobalMessage
        .watch(params, { fetchPolicy: 'no-cache' })
        .valueChanges.subscribe(
          (res) => {
            this.orderComments = res.data.fetchOrderLineMessage.comments;
            this.partComments = res.data.fetchPartMessage.comments;
            if (
              this.orderComments.length === 0 &&
              this.partComments.length === 0
            ) {
              this.onSubmit();
            } else {
              this.qcService.changeGlobalMessages(
                this.orderComments.concat(this.partComments)
              );
            }
            this.isLoading = res.loading;
          },
          (error) => {
            this.isLoading = false;
            this.messageType = 'error';
            this.message = error;
          }
        )
    );
  }

  // keyboard setting
  shortcuts: ShortcutInput[] = [];
  ngAfterViewInit(): void {
    this.shortcuts.push({
      key: ['ctrl + s'],
      label: 'Quick Access',
      description: 'Next Step',
      preventDefault: true,
      command: () => {
        this.onSubmit();
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSubmit();
    }
  }
}
