import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { asapScheduler, filter, map, of } from 'rxjs';
import Keyboard from 'simple-keyboard';
import { ReceivingService } from '../receiving.server';

@Component({
  selector: 'kickout',
  templateUrl: './kickout.component.html',
})
export class KickoutComponent implements OnInit {
  isLoading = false;
  keyboard: Keyboard;

  kickoutOptions = [
    { id: 1, content: 'Short Quantity' },
    { id: 2, content: 'Damaged' },
    { id: 3, content: 'Repackaging' },
    { id: 4, content: 'Wrong Parts' },
    { id: 5, content: 'Verify Quantity' },
    { id: 6, content: 'Mixed Parts' },
    { id: 7, content: 'Part Number Verification' },
    { id: 8, content: 'Kit Set' },
    { id: 0, content: 'Other' },
  ];

  kickoutForm = this._fb.group({
    kickoutReason: ['', Validators.required],
    otherReason: [''],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _service: ReceivingService
  ) {}
  ngOnInit(): void {
    this._service.changeTab(2);
  }

  @ViewChild('kickoutReason') InputKickout: ElementRef;
  ngAfterViewInit() {
    this.InputKickout.nativeElement.focus();
  }

  onChange = (input: string) => {
    this.kickoutForm.get('otherReason').setValue(input);
  };

  cancal(): void {
    this._router.navigateByUrl('receiving/verify');
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiving/kickout/location');
  }
}
