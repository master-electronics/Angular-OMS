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
  isLoading = true;
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
          const source = res.data.fetchWMSStatusView;
          const result = [
            { name: 'ITNs' },
            { name: 'Lines' },
            { name: 'Orders' },
          ];
          source.forEach((item) => {
            switch (item.StatusID) {
              case 0:
                result[0]['aP'] = item.ITN_Priority;
                result[0]['aT'] = item.ITN_Total;
                result[1]['aP'] = item.Line_Priority;
                result[1]['aT'] = item.Line_Total;
                result[2]['aP'] = item.Head_Priority;
                result[2]['aT'] = item.Head_Total;
                break;
              case 10:
                result[0]['bP'] = item.ITN_Priority;
                result[0]['bT'] = item.ITN_Total;
                result[1]['bP'] = item.Line_Priority;
                result[1]['bT'] = item.Line_Total;
                result[2]['bP'] = item.Head_Priority;
                result[2]['bT'] = item.Head_Total;
                break;

              case 15:
                result[0]['cP'] = item.ITN_Priority;
                result[0]['cT'] = item.ITN_Total;
                result[1]['cP'] = item.Line_Priority;
                result[1]['cT'] = item.Line_Total;
                result[2]['cP'] = item.Head_Priority;
                result[2]['cT'] = item.Head_Total;
                break;

              case 20:
                result[0]['dP'] = item.ITN_Priority;
                result[0]['dT'] = item.ITN_Total;
                result[1]['dP'] = item.Line_Priority;
                result[1]['dT'] = item.Line_Total;
                result[2]['dP'] = item.Head_Priority;
                result[2]['dT'] = item.Head_Total;
                break;

              case 30:
                result[0]['eP'] = item.ITN_Priority;
                result[0]['eT'] = item.ITN_Total;
                result[1]['eP'] = item.Line_Priority;
                result[1]['eT'] = item.Line_Total;
                result[2]['eP'] = item.Head_Priority;
                result[2]['eT'] = item.Head_Total;
                break;

              case 60:
                result[0]['fP'] = item.ITN_Priority;
                result[0]['fT'] = item.ITN_Total;
                result[1]['fP'] = item.Line_Priority;
                result[1]['fT'] = item.Line_Total;
                result[2]['fP'] = item.Head_Priority;
                result[2]['fT'] = item.Head_Total;
                break;

              case 63:
                result[0]['gP'] = item.ITN_Priority;
                result[0]['gT'] = item.ITN_Total;
                result[1]['gP'] = item.Line_Priority;
                result[1]['gT'] = item.Line_Total;
                result[2]['gP'] = item.Head_Priority;
                result[2]['gT'] = item.Head_Total;
                break;

              case 65:
                result[0]['hP'] = item.ITN_Priority;
                result[0]['hT'] = item.ITN_Total;
                result[1]['hP'] = item.Line_Priority;
                result[1]['hT'] = item.Line_Total;
                result[2]['hP'] = item.Head_Priority;
                result[2]['hT'] = item.Head_Total;
                break;

              case 80:
                result[0]['iP'] = item.ITN_Priority;
                result[0]['iT'] = item.ITN_Total;
                result[1]['iP'] = item.Line_Priority;
                result[1]['iT'] = item.Line_Total;
                result[2]['iP'] = item.Head_Priority;
                result[2]['iT'] = item.Head_Total;
                break;

              case 90:
                result[0]['kP'] = item.ITN_Priority;
                result[0]['kT'] = item.ITN_Total;
                result[1]['kP'] = item.Line_Priority;
                result[1]['kT'] = item.Line_Total;
                result[2]['kP'] = item.Head_Priority;
                result[2]['kT'] = item.Head_Total;
                break;
            }
          });
          this.isLoading = false;
          return result;
        })
      );
  }

  // table setting:
}
