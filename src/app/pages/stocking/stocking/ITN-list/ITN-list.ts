import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  FetchSuggetionLocationForSortingGQL,
  UpdateInventoryAfterSortingGQL,
  VerifyContainerForSortingGQL,
} from 'src/app/graphql/stocking.graphql-gen';
import { sqlData } from 'src/app/shared/sqlData';
import { environment } from 'src/environments/environment';
import { StockingService } from '../../stocking.server';

@Component({
  selector: 'sorting-location',
  templateUrl: './sorting-location.component.html',
})
export class ITNListComponent implements OnInit {
  isLoading = false;
  title = '';
  ITNList = [];

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: StockingService,
    private _verifyContainer: VerifyContainerForSortingGQL,
    private _updateInventory: UpdateInventoryAfterSortingGQL,
    private _fetchLocation: FetchSuggetionLocationForSortingGQL
  ) {
    //
  }

  ngOnInit(): void {
    //
  }

  continue(): void {
    this._router.navigate(['/stocking/stocking']);
  }
}
