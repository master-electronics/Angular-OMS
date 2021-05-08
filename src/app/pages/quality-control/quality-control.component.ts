import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'quality-control',
  templateUrl: './quality-control.component.html',
})
export class QualityControlComponent implements OnInit {
  @ViewChild('stepPage') stepPage;
  title = 'Quality Control';
  constructor(private commonService: CommonService) {
    //
  }
  ngOnInit(): void {
    this.commonService.changeTitle(this.title);
  }
}
