import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { ReceivingService } from './data/receiving.server';

@Component({
  templateUrl: './receiving.component.html',
})
export class ReceivingComponent {
  currentTab$ = this._service.currentTab$;
  constructor(
    private commonService: CommonService,
    public _service: ReceivingService
  ) {
    this.commonService.changeNavbar('Receiving');
  }
  receivingSteps = [
    { title: 'Receipt', subtitle: '', description: '' },
    { title: 'Part', subtitle: '', description: '' },
    { title: 'Verify', subtitle: '', description: '' },
  ];
}
