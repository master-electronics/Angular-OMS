import { Component, Input, OnInit } from '@angular/core';
import { QualityControlService } from '../quality-control.server';

@Component({
  selector: 'step-tabs',
  templateUrl: './step-tabs.component.html',
})
export class StepTabsComponent implements OnInit {
  activeTab: number;

  constructor(private qcService: QualityControlService) {
    //
  }
  ngOnInit(): void {
    //
    this.qcService.activeTab.subscribe((response) => (this.activeTab = response));
  }
}
