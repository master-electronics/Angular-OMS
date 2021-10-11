import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PickService } from '../pick.server';

@Component({
  selector: 'step-tabs',
  templateUrl: './step-tabs.component.html',
})
export class StepTabsComponent implements OnInit, OnDestroy {
  tabStatus = ['process', 'wait', 'wait', 'wait'];

  private subscription: Subscription = new Subscription();
  constructor(private pickService: PickService) {
    //
  }
  ngOnInit(): void {
    this.subscription.add(
      this.pickService.tabStatus$.subscribe((res) => (this.tabStatus = res))
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
