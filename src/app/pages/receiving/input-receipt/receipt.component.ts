import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Keyboard from 'simple-keyboard';
import { ReceivingService } from '../receiving.server';
import { Layout } from '../../../components/simple-keyboard/simple-keyboard.component';

@Component({
  selector: 'receipt',
  templateUrl: './receipt.component.html',
})
export class ReceiptComponent implements OnInit {
  keyboard: Keyboard;
  isLoading = false;
  layout = Layout.numeric;
  router$;

  inputForm = new FormGroup({
    receiptNumber: new FormControl('', [Validators.required]),
  });

  constructor(private _router: Router, private _service: ReceivingService) {}
  ngOnInit(): void {
    this._service.changeTab(0);
  }

  onChange = (input: string) => {
    if (input) {
      this.inputForm.get('receiptNumber').setValue(input);
    }
  };

  onSubmit(): void {
    this._router.navigateByUrl('receiving/part');
  }
}
