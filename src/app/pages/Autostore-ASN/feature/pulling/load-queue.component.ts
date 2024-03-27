import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { PullQueueService } from '../../data/pull-queue.service';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzTableModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
  ],
  template: `<div *ngIf="data$ | async"></div>
    <div *ngIf="update$ | async"></div>
    <div nz-row [nzGutter]="8">
      <div nz-col nzSpan="3">
        <div style="margin-bottem: 16px">
          <button
            nz-button
            nzType="primary"
            [nzLoading]="isProcessing"
            (click)="loadQueue()"
          >
            Load
          </button>
          <button
            nz-button
            nzType="default"
            [disabled]="!isProcessing"
            (click)="stopLoading()"
          >
            Stop
          </button>
        </div>
      </div>
      <div>
        <input
          nz-input
          [(ngModel)]="loadTarget"
          placeholder="Quantity to load"
          type="number"
        />
      </div>
      <div nz-col nzSpan="1"></div>
      <div nz-col>
        <div>Total ITNs Loaded: {{ loadedCount }}</div>
      </div>
    </div>
    <nz-table #loadedTable [nzData]="loadedList" [nzNoResult]="noResults">
      <thead>
        <tr>
          <th>PRC</th>
          <th>PartNumber</th>
          <th>ITNs Loaded</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of loadedList">
          <td>{{ data.ProductCode }}</td>
          <td>{{ data.PartNumber }}</td>
          <td>{{ data.Count }}</td>
        </tr>
      </tbody>
    </nz-table>
    <!--
    <div *ngIf="loadedList">
      <div *ngFor="let item of loadedList">
        {{ item.ProductCode }}-{{ item.PartNumber }}
      </div>
    </div>
-->
    <!--<div (click)="this.stop = true">Stop</div>
    <div>{{ stop }}</div>-->
    <ng-template #noResults></ng-template> `,
})
export class LoadQueue implements OnInit {
  private _userInfo = inject(StorageUserInfoService);
  constructor(
    private _pullQueueService: PullQueueService,
    private _fb: FormBuilder
  ) {}
  public data$;
  public update$;
  loadedList;
  rowNumber = 1;
  stop = false;
  pullQueue = [];
  isProcessing = false;
  loadTarget;
  loadedCount = 0;
  rowITNCount = 0;
  reelList = [
    'REl',
    'Reel',
    'reel',
    'REEL',
    'Reels',
    'REL',
    '7" REEL',
    'RL',
    'T & R',
    'T/R',
    'Tape & Reel',
    'Tape and Reel',
    'TAPE REEL',
    'Tape&Reel',
    'TAPE&REEL',
    'TAPE/AMO',
    'TAPE/REEL',
    'TAPEN REEL',
  ];

  ngOnInit(): void {
    //this.loadedList = [{ ProductCode: '1', PartNumber: 'one' }];
  }

  test() {
    this.data$ = this._pullQueueService.validateProductCode('ABS');
  }

  loadQueue() {
    if (!this.loadTarget) {
      return;
    }

    if (this.loadedCount >= this.loadTarget) {
      this.isProcessing = false;
      this.stop = false;
      return;
    }
    this.stop = false;
    if (!this.loadedList) {
      this.loadedList = [];
    }

    this.isProcessing = true;

    if (this.rowNumber < 7 && !this.stop) {
      this.data$ = this._pullQueueService.pullRow(this.rowNumber).pipe(
        map((res) => {
          this.loadedList.push({
            ProductCode: res.data.fetchPullQueueRow[0].ProductCode,
            PartNumber: res.data.fetchPullQueueRow[0].PartNumber,
            Count: 0,
          });
          ++this.rowNumber;

          return this.processRow(res.data.fetchPullQueueRow[0]);
        })
      );
    } else {
      this.isProcessing = false;
    }
  }

  processRow(row) {
    this.data$ = this._pullQueueService
      .validateProductCode(row.ProductCode)
      .pipe(
        switchMap((res) => {
          if (res.data.findProductCode) {
            //console.log(row.ProductCode);
            return this._pullQueueService.validatePartNumber(
              res.data.findProductCode._id,
              row.PartNumber
            );
          }

          return of(null);
        }),
        switchMap((res) => {
          if (!res.data.findProduct) {
            return of(res);
          }

          if (this.reelList.includes(res.data.findProduct.PackType)) {
            console.log('reel - skip');
            return of(res);
          }
          return this.processASNReplenishment(
            row.ProductCode,
            row.PartNumber,
            row
          );
        }),
        switchMap((res) => {
          this.loadQueue();
          return of(res);
        })
      );
  }

  processASNReplenishment(ProductCode, PartNumber, Row) {
    return this.autostoreQuantity(ProductCode, PartNumber).pipe(
      switchMap((res) => {
        let qty: number = Row._90_day_usage;
        if (res.data.fetchAutoStoreQuantity[0]?.Quantity > 0) {
          qty =
            res.data.fetchAutoStoreQuantity[0].Quantity < Row._90_day_usage
              ? Row._90_day_usage - res.data.fetchAutoStoreQuantity[0].Quantity
              : 0;

          // if (qty > 0) {
          //   return this._pullQueueService.standardPack(
          //     Row.ProductCode,
          //     Row.PartNumber
          //   );
          // }
        }

        return of(qty);
      }),
      switchMap((res) => {
        const qty = res;
        if (qty > 0) {
          return this.processReplenishmentInventory(
            qty,
            Row.ProductCode,
            Row.PartNumber
          );
          // return this._pullQueueService.standardPack(
          //   Row.ProductCode,
          //   Row.PartNumber
          // );
        }

        return of(false);
      }),
      switchMap((res) => {
        if (res) {
          // console.log(res);
          // const one = Math.trunc(Row._90_day_usage / Number(res));
          // const two =
          //   Math.trunc(Row._90_day_usage / Number(res)) ==
          //   Row._90_day_usage / Number(res)
          //     ? 0
          //     : Number(res);
          // const qtyNeeded = one * Number(res) + two;
          // return this._pullQueueService
          //   .replenishmentInventory(
          //     Row.ProductCode,
          //     Row.PartNumber,
          //     Number(res),
          //     this._userInfo.distributionCenter
          //   )
          //   .pipe(
          //     map((res) => {
          //       res.data.fetchASNReplenishmentInventory.forEach((inventory) => {
          //         console.log(inventory.InventoryTrackingNumber);
          //       });
          //     })
          //   );
        }

        return of(res);
      })
    );
  }

  autostoreQuantity(ProductCode, PartNumber) {
    return this._pullQueueService.autostoreQuantity(
      this._userInfo.distributionCenter,
      ProductCode,
      PartNumber
    );
  }

  processReplenishmentInventory(
    QuantityToLoad: number,
    ProductCode,
    PartNumber
  ) {
    let stdPack;
    return this._pullQueueService.standardPack(ProductCode, PartNumber).pipe(
      switchMap((res) => {
        stdPack = res;
        const one = Math.trunc(QuantityToLoad / Number(res));
        const two =
          Math.trunc(QuantityToLoad / Number(res)) ==
          QuantityToLoad / Number(res)
            ? 0
            : Number(res);

        const qtyNeeded = one * Number(res) + two;

        return of(qtyNeeded);
      }),
      switchMap((res) => {
        return this._pullQueueService
          .replenishmentInventory(
            ProductCode,
            PartNumber,
            Number(stdPack),
            this._userInfo.distributionCenter
          )
          .pipe(
            map((res) => {
              const inventoryList = [];
              res.data.fetchASNReplenishmentInventory.forEach((inventory) => {
                inventoryList.push(inventory);
              });

              return inventoryList;
            }),
            switchMap(async (res) => {
              let quantityLoaded = 0;
              this.rowITNCount = 0;

              //console.log(res);
              //return of(res);
              const data = [];
              res.forEach(async (inventory) => {
                //console.log('1');
                if (QuantityToLoad - quantityLoaded > 0) {
                  //console.log('2');
                  // const result = await this.insertASNReplenishment(
                  //   inventory._id,
                  //   inventory.InventoryTrackingNumber
                  // );
                  this.rowITNCount++;
                  quantityLoaded += Number(inventory.QuantityOnHand);
                  // const result = this._pullQueueService.verifyASNPullingLocation(
                  //   inventory['BinLocation']
                  // );
                  //data.push(result);
                  data.push(inventory);
                }
              });

              const row = this.loadedList.find(
                (item) =>
                  item.ProductCode == ProductCode &&
                  item.PartNumber == PartNumber
              );

              if (row) {
                row.Count = this.rowITNCount;
              }

              await this.test2(data);

              return of(res);
              //return combineLatest(data);
            }) //,
            // switchMap((res) => {
            //   res.forEach((location) => {
            //     if (location['data']['findContainer']['_id']) {
            //       console.log(location['data']['findContainer']['_id']);
            //     }
            //   });
            //   return of(res);
            // })
          );
      })
    );
  }

  test2(list) {
    console.log('3');
    const itemList = [];
    list.forEach(async (inventory) => {
      console.log('4');
      itemList.push({
        InventoryID: inventory._id,
        ITN: inventory.InventoryTrackingNumber,
      });
    });

    this.insertASNReplenishment(itemList);
  }

  async insertASNReplenishment(ItemList) {
    const replenItems = [];
    console.log('5');
    ItemList.forEach((item) => {
      replenItems.push({ InventoryID: item.InventoryID, Status: 'open' });
    });
    this.update$ = await this._pullQueueService
      .insertReplenishmentItem(replenItems)
      .pipe(
        map((res) => {
          console.log('6');
        })
      );
    // .pipe(
    //   switchMap((res) => {
    //     console.log('C');
    //     console.log(res);
    //     if (res['data']) {
    //       if (res['data']['insertASNReplenishmentItem']) {
    //         if (res['data']['insertASNReplenishmentItem']._id) {
    //           this.loadedCount++;
    //         }
    //       }
    //     }
    //     // if (res['data']?['insertASNReplenishmentItem']?._id) {
    //     //   this.loadedCount++;
    //     // }

    //     return of(res);
    //   }),
    // switchMap((res) => {
    //   if (this.loadedCount >= this.loadTarget) {
    //     return of(res);
    //   }

    //   return this._pullQueueService.updateMERP(
    //     this._userInfo.userName,
    //     ITN
    //   );
    // })
    //);
  }

  stopLoading() {
    this.stop = true;
    this.isProcessing = false;
    this.data$ = of(true);
  }
}
