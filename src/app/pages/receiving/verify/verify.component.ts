import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { asapScheduler, delay, of } from 'rxjs';
import { ReceivingService } from '../receiving.server';

@Component({
  selector: 'verify',
  templateUrl: './verify.component.html',
})
export class VerifyComponent {
  fetchInfo$;
  imgURL = `https://www.onlinecomponents.com/images/parts/largeimages/`;
  isLoading;

  constructor(
    private _fb: UntypedFormBuilder,
    private _router: Router,
    private _service: ReceivingService
  ) {
    _service.changeTab(2);
  }

  ngOnInit(): void {
    //
  }

  onSubmit(): void {
    //
  }

  kickoutVisible = false;
  @ViewChild('kickoutInput') kickoutInput: ElementRef;

  open(): void {
    this.kickoutVisible = true;
    of([])
      .pipe(delay(0))
      .subscribe(() => {
        this.kickoutInput.nativeElement.select();
      });
  }

  close(): void {
    this.kickoutVisible = false;
  }

  kickoutOptions = [
    { id: 1, content: 'Short Quantity' },
    { id: 2, content: 'Damaged' },
    { id: 3, content: 'Repackaging' },
    { id: 4, content: 'Wrong Parts' },
    { id: 5, content: 'Verify Quantity' },
    { id: 6, content: 'Mixed Parts' },
    { id: 7, content: 'Part Number Verification' },
    { id: 8, content: 'Kit Set' },
    { id: 9, content: 'Over Shipment' },
  ];

  kickoutForm = this._fb.group({
    kickoutReason: ['', Validators.required],
  });

  onKickout(): void {
    //
  }
}
