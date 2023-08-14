import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QualityControlService } from '../quality-control.server';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStepsModule } from 'ng-zorro-antd/steps';

@Component({
  selector: 'step-tabs',
  templateUrl: './step-tabs.component.html',
  standalone: true,
  imports: [NzStepsModule, NzGridModule],
})
export class StepTabsComponent implements OnInit, OnDestroy {
  tabStatus = ['process', 'wait', 'wait', 'wait'];

  private subscription: Subscription = new Subscription();
  constructor(private qcService: QualityControlService) {
    //
  }
  ngOnInit(): void {
    this.subscription.add(
      this.qcService.tabStatus$.subscribe((res) => (this.tabStatus = res))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
