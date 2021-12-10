import { Component, OnInit } from '@angular/core';

import {
  FetchOrderDetailforitnViewGQL,
  FetchOrderLineDetailforWmsCountGQL,
  SearchIntForWmsCount,
} from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
})
export class OrderListComponent implements OnInit {
  OrderInfo$;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fetchOrderDetail: FetchOrderDetailforitnViewGQL,
    private findDetail: FetchOrderLineDetailforWmsCountGQL
  ) {}

  ngOnInit(): void {
    const urlParams = { ...this.route.snapshot.queryParams };
    if (urlParams.statusID) {
      const detail: SearchIntForWmsCount = {
        StatusID: Number(urlParams.statusID),
        Priority: urlParams.priority === '1' ? true : null,
      };
      this.fetchData(detail);
    } else {
      this.router.navigate(['/wmsstatus']);
    }
  }

  fetchData(filter: SearchIntForWmsCount): void {
    this.OrderInfo$ = this.findDetail
      .fetch({ filter: filter }, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          return res.data.fetchOrderLineDetailforWMSCount;
        })
      );
  }
}
