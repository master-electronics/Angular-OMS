import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  FetchInventoryInUserContainerGQL,
  VerifyContainerForSortingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { sqlData } from 'src/app/shared/sqlData';
import { environment } from 'src/environments/environment';
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
    if (this.userLocation) {
      this.isLoading = true;
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
