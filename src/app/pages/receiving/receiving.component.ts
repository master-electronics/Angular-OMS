import { Component } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'receiving',
  templateUrl: './receiving.component.html',
})
export class ReceivingComponent {
  constructor(private commonService: CommonService) {
    commonService.changeNavbar('Receiving');
  }
}
