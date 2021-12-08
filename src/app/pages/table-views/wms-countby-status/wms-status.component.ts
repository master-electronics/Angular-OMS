import { Component, OnInit } from '@angular/core';

import { CommonService } from '../../../shared/services/common.service';
import { FetchWmsStatusViewGQL } from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';

@Component({
  selector: 'wms-status',
  templateUrl: './wms-status.component.html',
})
export class WmsStatusComponent implements OnInit {
  fetchTable$;
  constructor(
    private commonService: CommonService,
    private fetchtable: FetchWmsStatusViewGQL
  ) {
    this.commonService.changeNavbar('WMS-Status');
  }

  ngOnInit(): void {
    this.fetchTable$ = this.fetchtable
      .fetch(null, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          return res.data.fetchWMSStatusView;
        })
      );
  }

  // table setting:
}
