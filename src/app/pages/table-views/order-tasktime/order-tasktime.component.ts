import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CommonService } from '../../../shared/services/common.service';
import { FetchOrderTasktimeGQL } from '../../../graphql/tableViews.graphql-gen';
import {
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { OrderBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { map } from 'rxjs/operators';
import { NgFor, AsyncPipe } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'order-tasktime',
  templateUrl: './order-tasktime.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzTableModule,
    NgFor,
    AsyncPipe,
  ],
})
export class OrderTasktimeComponent implements OnInit {
  isLoading = false;
  fetchTable$: Observable<any>;

  constructor(
    private commonService: CommonService,
    private fb: UntypedFormBuilder,
    private fetchTable: FetchOrderTasktimeGQL
  ) {
    this.commonService.changeNavbar('Task Counting');
  }

  filterForm = this.fb.group({
    target: ['', [Validators.pattern(OrderBarcodeRegex)]],
  });

  ngOnInit(): void {
    //
  }

  resetForm(): void {
    this.filterForm.reset({
      target: '',
    });
  }

  onSubmit(): void {
    if (this.filterForm.invalid || this.isLoading) {
      return;
    }
    // prepare query data then send
    this.isLoading = true;
    this.fetchTable$ = this.fetchTable
      .fetch(
        {
          target: this.filterForm.get('target').value,
          limit: 200,
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        map((res) => {
          this.isLoading = false;
          return res.data.fetchOrderTasktime.map((ele) => {
            const result = { ...ele };
            const qcFirst = new Date(Number(ele.qcFirst));
            const qcLast = new Date(Number(ele.qcLast));
            const agIn = new Date(Number(ele.agIn));
            const agOut = new Date(Number(ele.agOut));
            if (ele.agIn) {
              result.agIn = agIn.toLocaleString();
            }
            if (ele.agOut) {
              result.agOut = agOut.toLocaleString();
            }
            if (qcFirst !== qcLast) {
              result['qcTime'] = this.dateFormat(qcFirst, qcLast);
            }
            if (ele.agIn && ele.agOut) {
              result['agTime'] = this.dateFormat(agIn, agOut);
            }
            result.qcFirst = qcFirst.toLocaleString();
            result.qcLast = qcLast.toLocaleString();
            return result;
          });
        })
      );
  }

  dateFormat(start: Date, end: Date): string {
    const qcTime = Math.ceil((end.getTime() - start.getTime()) / 60000);
    const hours = Math.floor(qcTime / 60);
    const minutes = qcTime % 60;
    let result = '';
    if (hours) {
      result = `${hours}hr`;
    }
    if (minutes) {
      result += `${minutes}min`;
    }
    return result;
  }
}
