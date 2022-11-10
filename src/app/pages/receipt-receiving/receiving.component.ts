import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { ReceivingService } from './data/receiving.server';

@Component({
  templateUrl: './receiving.component.html',
})
export class ReceivingComponent {
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
    { title: 'PO Table', subtitle: '', description: '' },
    { title: 'ITN', subtitle: '', description: '' },
  ];
}
