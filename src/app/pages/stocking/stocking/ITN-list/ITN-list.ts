import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { FetchInventoryInUserContainerGQL } from 'src/app/graphql/stocking.graphql-gen';
import { StockingService } from '../../stocking.server';

@Component({
  selector: 'ITN-list',
  templateUrl: './ITN-list.html',
})
export class ITNListComponent implements OnInit {
  isLoading = false;
  title = 'ITN List';
  ITNList = [];
  userLocation: string;
  init$ = new Observable();

  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _service: StockingService,
    private _fetchITNList: FetchInventoryInUserContainerGQL
  ) {
    //
  }

  ngOnInit(): void {
    this.userLocation = this._route.snapshot.queryParams['userLocation'];
    if (!this._service.userContainerID) {
      this._router.navigate(['/stocking/stocking']);
    }
    if (this.userLocation) {
      this.isLoading = true;
      this.title = `Personal Location Contents`;
      this.init$ = this._fetchITNList
        .fetch(
          {
            ContainerID: this._service.userContainerID,
          },
          { fetchPolicy: 'network-only' }
        )
        .pipe(
          map((res) => {
            this.isLoading = false;
            this.ITNList = res.data.findContainer[0].INVENTORies.map((item) => {
              return {
                ITN: item.InventoryTrackingNumber,
                Quantity: item.QuantityOnHand,
              };
            });
            if (!this.ITNList.length) {
              this._router.navigate(['/stocking/stocking']);
            }
          }),
          catchError((err) => {
            this.isLoading = false;
            return err;
          })
        );
    } else {
      this.ITNList = this._service.ITNListInContainer;
    }
  }

  continue(): void {
    if (this.userLocation) {
      this._router.navigate(['/stocking/stocking']);
      return;
    }
    this._router.navigate(['/stocking/stocking/verify']);
  }
}
