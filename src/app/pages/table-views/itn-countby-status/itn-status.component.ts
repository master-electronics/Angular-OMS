import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../../shared/services/common.service';
import { FetchItnStatusViewGQL } from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';

@Component({
  selector: 'itn-status',
  templateUrl: './itn-status.component.html',
})
export class ItnStatusComponent implements OnInit {
  constructor(
    private commonService: CommonService,
    private fetchtable: FetchItnStatusViewGQL
  ) {
    this.commonService.changeNavbar('ITN-Status');
  }

  ngOnInit(): void {
    this.fetchTable$ = this.fetchtable.fetch().pipe(
      map((res) => {
        return res.data.fetchITNStatusView;
      })
    );
  }

  // table setting:
  fetchTable$;
  searchVisible = false;
  searchValue = '';
  orderList = [];
  orderListDisplay = [];
}
