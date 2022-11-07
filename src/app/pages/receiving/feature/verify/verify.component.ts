import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReceivingService } from '../../data/receiving.server';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
})
export class VerifyComponent {
  fetchInfo$;
  imgURL = `https://www.onlinecomponents.com/images/parts/largeimages/`;
  isLoading;

  constructor(private _router: Router, private _service: ReceivingService) {
    _service.changeTab(2);
  }

  ngOnInit(): void {
    //
  }

  onSubmit(): void {
    //
  }

  kickout(): void {
    this._router.navigateByUrl('receiving/kickout');
  }

  back(): void {
    this._router.navigateByUrl('receiving/part');
  }
}
