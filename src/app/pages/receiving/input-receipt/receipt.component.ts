import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { asapScheduler, filter, map, of } from 'rxjs';
import Keyboard from 'simple-keyboard';
import { ReceivingService } from '../receiving.server';

@Component({
  selector: 'receipt',
  templateUrl: './receipt.component.html',
})
export class ReceiptComponent implements OnInit {
  keyboard: Keyboard;
  isLoading = false;
  router$;

  inputForm = new FormGroup({
    receiptNumber: new FormControl('', [Validators.required]),
  });

  constructor(private _router: Router, private _service: ReceivingService) {}
  ngOnInit(): void {
    this._service.changeTab(0);
  }

  @ViewChild('receiptNumber') InputField: ElementRef;
  ngAfterViewInit() {
    this.InputField.nativeElement.focus();
    asapScheduler.schedule(() => {
      this.keyboard = new Keyboard({
        onChange: (input) => this.onChange(input),
        onKeyPress: (button) => this.onKeyPress(button),
        layout: {
          default: ['1 2 3', '4 5 6', '7 8 9', '0 {bksp}'],
        },
        theme: 'hg-theme-default hg-layout-numeric numeric-theme',
      });
    });
  }

  onChange = (input: string) => {
    this.inputForm.get('receiptNumber').setValue(input);
  };

  onKeyPress = (button: string) => {
    //
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  isShow = false;
  onFocus(): void {
    this.isShow = true;
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiving/part');
  }
}
