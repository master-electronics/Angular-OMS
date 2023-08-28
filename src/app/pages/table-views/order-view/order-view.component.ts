import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { NavbarTitleService } from '../../../shared/services/navbar-title.service';
import {
  FetchOrderViewGQL,
  OrderViewFilter,
} from '../../../graphql/tableViews.graphql-gen';
import { map } from 'rxjs/operators';
import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableModule,
} from 'ng-zorro-antd/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { FormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

interface DataItem {
  OrderNumber: string;
  NOSINumber: string;
  Status: string;
  Priority: boolean;
  ShippingMethod: string;
  Unpicked: number;
  Aggregated: number;
  InProcess: number;
}

interface ColumnItem {
  name: string;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<DataItem> | null;
}

@Component({
  selector: 'order-view',
  templateUrl: './order-view.component.html',
  standalone: true,
  imports: [
    NgIf,
    NzTableModule,
    NzButtonModule,
    NgFor,
    RouterLink,
    NzDropDownModule,
    NzInputModule,
    FormsModule,
    NzWaveModule,
    AsyncPipe,
  ],
})
export class OrderViewComponent implements OnInit {
  title = 'Order View';
  message = '';
  messageType = 'error';
  searchType: string;
  OrderInfo$: Observable<any>;

  constructor(
    private _title: NavbarTitleService,
    private _route: ActivatedRoute,
    private fetchOrderView: FetchOrderViewGQL
  ) {
    this._title.update(this.title);
  }

  ngOnInit(): void {
    const urlParams = { ...this._route.snapshot.queryParams };
    const filter = {
      Priority: null,
      StatusID: null,
    };
    if (urlParams.statusID) {
      filter.StatusID = Number(urlParams.statusID);
    }
    if (urlParams.priority) {
      filter.Priority = true;
    }
    this.search(filter);
  }

  search(filter: OrderViewFilter): void {
    this.message = '';
    this.OrderInfo$ = this.fetchOrderView.fetch({ filter }).pipe(
      map((res) => {
        const shipMethodSet = new Set<string>();
        const statusSet = new Set<string>();
        res.data.fetchOrderView.forEach((element) => {
          shipMethodSet.add(element.ShippingMethod.trim());
          statusSet.add(element.Status.trim());
        });
        this.orderList = [...res.data.fetchOrderView];
        this.orderListDisplay = [...this.orderList];

        this.listOfColumns = [
          {
            name: 'Status',
            listOfFilter: [...statusSet].map((res) => {
              return { text: res, value: res };
            }),
            filterFn: (list: string[], item: DataItem) =>
              list.some((name) => item.Status.indexOf(name) !== -1),
          },
          {
            name: 'Priority',
            listOfFilter: [
              { text: 'Yes', value: true },
              { text: 'No', value: false },
            ],
            filterFn: (list: boolean[], item: DataItem) =>
              list.some((priority) => priority === item.Priority),
          },
          {
            name: 'ShipMethod',
            listOfFilter: [...shipMethodSet].map((res) => {
              return { text: res, value: res };
            }),
            filterFn: (list: string[], item: DataItem) =>
              list.some((method) => item.ShippingMethod.indexOf(method) !== -1),
          },
        ];
        return res.data.fetchOrderView;
      })
    );
  }

  // table setting:
  searchVisible = false;
  searchValue = '';
  orderList = [];
  orderListDisplay = [];

  resetSearch(): void {
    this.searchValue = '';
    this.searchOrder();
  }

  searchOrder(): void {
    this.searchVisible = false;
    this.orderListDisplay = this.orderList.filter(
      (item: DataItem) =>
        `${item.OrderNumber}-${item.NOSINumber}`.indexOf(this.searchValue) !==
        -1
    );
  }

  listOfColumns: ColumnItem[];

  trackByName(_: number, item: ColumnItem): string {
    return item.name;
  }
}
