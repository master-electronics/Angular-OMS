import { Component, OnInit } from '@angular/core';

import { FindOrderByStatusGQL } from '../../../graphql/tableViews.graphql-gen';
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
    private fetchOrder: FindOrderByStatusGQL
  ) {}

  ngOnInit(): void {
    const urlParams = { ...this.route.snapshot.queryParams };
    if (urlParams.statusID) {
      this.fetchData(
        urlParams.priority === '1' ? true : null,
        Number(urlParams.statusID)
      );
    }
  }

  fetchData(PriorityPinkPaper: boolean, StatusID: number): void {
    this.OrderInfo$ = this.fetchOrder
      .fetch({ PriorityPinkPaper, StatusID }, { fetchPolicy: 'network-only' })
      .pipe(
        map((res) => {
          return res.data.findOrderByStatus;
        })
      );
  }
}
