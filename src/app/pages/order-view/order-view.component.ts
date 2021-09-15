import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';

import { CommonService } from '../../shared/services/common.service';
import { FetchOrderViewGQL } from '../../graphql/orderView.graphql-gen';
import { map } from 'rxjs/operators';
import { NzTableFilterFn, NzTableFilterList } from 'ng-zorro-antd/table';

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
})
export class OrderViewComponent implements OnInit, OnDestroy, AfterViewInit {
  title = 'Order View';
  message = '';
  messageType = 'error';
  searchType: string;
  OrderInfo$: Observable<any>;

  private subscription: Subscription = new Subscription();
  constructor(
    private commonService: CommonService,
    private titleService: Title,
    private fetchOrderView: FetchOrderViewGQL
  ) {
    this.commonService.changeNavbar(this.title);
    this.titleService.setTitle(this.title);
  }

  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.message = '';
    this.OrderInfo$ = this.fetchOrderView
      .watch(null, { fetchPolicy: 'network-only' })
      .valueChanges.pipe(
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
                list.some(
                  (method) => item.ShippingMethod.indexOf(method) !== -1
                ),
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
