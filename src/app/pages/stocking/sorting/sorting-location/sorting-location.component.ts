import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SortingInfo } from '../../stocking.server';

@Component({
  selector: 'sorting-location',
  templateUrl: './sorting-location.component.html',
})
export class SortingLocationComponent implements OnInit {
  isLoading = false;
  alertType = 'error';
  alertMessage = '';
  locationList = [];
  itemInfo = {} as SortingInfo;

  constructor(private _fb: FormBuilder, private _router: Router) {
    //
  }

  locationForm = this._fb.group({
    location: ['', [Validators.required]],
  });

  ngOnInit(): void {
    //
  }

  reprint(): void {
    //
  }

  onSubmit(): void {
    //
  }
}
