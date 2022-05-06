import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SortingInfo, StockingService } from '../../stocking.server';

@Component({
  selector: 'sorting-location',
  templateUrl: './sorting-location.component.html',
})
export class SortingLocationComponent implements OnInit {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  locationList = [];
  sortingInfo = {} as SortingInfo;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: StockingService
  ) {
    //
  }

  locationForm = this._fb.group({
    location: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.sortingInfo = this._service.sortingInfo;
    if (!this.sortingInfo) {
      this._router.navigate(['/stocking/sorting']);
    }
  }

  reprint(): void {
    //
  }

  onSubmit(): void {
    //
  }
}
