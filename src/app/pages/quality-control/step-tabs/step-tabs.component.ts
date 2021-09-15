import { Component, OnInit } from '@angular/core';
import { QualityControlService } from '../quality-control.server';

@Component({
  selector: 'step-tabs',
  templateUrl: './step-tabs.component.html',
})
export class StepTabsComponent implements OnInit {
  tabStatus = ['process', 'wait', 'wait', 'wait'];

  constructor(private qcService: QualityControlService) {
    //
  }
  ngOnInit(): void {
    this.qcService.tabStatus$.subscribe((res) => (this.tabStatus = res));
  }
}
