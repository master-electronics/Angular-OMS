import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReceivingService } from '../receiving.server';

@Component({
  selector: 'step-tabs',
  templateUrl: './step-tabs.component.html',
})
export class StepTabsComponent implements OnInit, OnDestroy {
  receivingSteps = [
    { title: 'Receipt' },
    { title: 'Part' },
    { title: 'Verify' },
  ];
  currentTab = 0;
  private subscription: Subscription = new Subscription();
  constructor(private _service: ReceivingService) {}
  ngOnInit(): void {
    this.subscription.add(
      this._service.currentTab$.subscribe((res) => (this.currentTab = res))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
