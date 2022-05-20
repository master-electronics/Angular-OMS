import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonService } from 'src/app/shared/services/common.service';
import { StockingService } from './stocking.server';

@Component({
  selector: 'stocking',
  templateUrl: './stocking.component.html',
})
export class StockingComponent implements OnInit {
  constructor(
    private _service: StockingService,
    private _commonService: CommonService,
    private _title: Title
  ) {
    this._title.setTitle('Stocking');
    this._commonService.changeNavbar('Stocking');
  }
  ngOnInit(): void {
    this._service.changeSortingInfo(null);
  }
}
