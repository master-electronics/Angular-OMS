import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Keyboard from 'simple-keyboard';
import { ReceivingService } from '../receiving.server';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { asapScheduler, of } from 'rxjs';

@Component({
  selector: 'part',
  templateUrl: './part.component.html',
})
export class PartComponent implements OnInit {
  constructor(private _router: Router, private _service: ReceivingService) {}
  partNumberList = [
    {
      PartNumber: '1234',
      ProductCode: 'abc',
    },
    {
      PartNumber: '45678',
      ProductCode: 'oiuh',
    },
    {
      PartNumber: '1234',
      ProductCode: 'erw',
    },
    {
      PartNumber: '1234',
      ProductCode: 'xxdf',
    },
    {
      PartNumber: '1234',
      ProductCode: 'fdsf',
    },
    {
      PartNumber: '1234',
      ProductCode: 'duufe',
    },
    {
      PartNumber: '1234',
      ProductCode: 'sadfa',
    },
    {
      PartNumber: '1234',
      ProductCode: 'pxdy',
    },
    {
      PartNumber: '1234',
      ProductCode: 'xyz',
    },
  ];
  keyboard: Keyboard;
  isLoading = false;
  singleValue;

  inputForm = new FormGroup({
    partNumber: new FormControl('', [
      Validators.required,
      this.partNumberSearch(),
    ]),
  });

  partNumberSearch(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }
      const isVaild = this.partNumberList.some((part) => {
        return (
          part.ProductCode.toLowerCase() + part.PartNumber.toLowerCase() ===
          value.toLowerCase()
        );
      });
      return !isVaild ? { partNumberSearch: true } : null;
    };
  }

  ngOnInit(): void {
    this._service.changeTab(1);
  }

  ngAfterViewInit() {
    asapScheduler.schedule(() => {
      this.keyboard = new Keyboard({
        onChange: (input) => this.onChange(input),
        onKeyPress: (button) => this.onKeyPress(button),
        mergeDisplay: true,
        preventMouseDownDefault: true,
        layoutName: 'default',
        layout: {
          default: [
            'q w e r t y u i o p',
            'a s d f g h j k l',
            '{shift} z x c v b n m {backspace}',
            '{numbers} {space} {ent}',
          ],
          shift: [
            'Q W E R T Y U I O P',
            'A S D F G H J K L',
            '{shift} Z X C V B N M {backspace}',
            '{numbers} {space} {ent}',
          ],
          numbers: ['1 2 3', '4 5 6', '7 8 9', '{abc} 0 {backspace}'],
        },
        display: {
          '{numbers}': '123',
          '{ent}': 'return',
          '{escape}': 'esc ⎋',
          '{tab}': 'tab ⇥',
          '{backspace}': '⌫',
          '{capslock}': 'caps lock ⇪',
          '{shift}': '⇧',
          '{controlleft}': 'ctrl ⌃',
          '{controlright}': 'ctrl ⌃',
          '{altleft}': 'alt ⌥',
          '{altright}': 'alt ⌥',
          '{metaleft}': 'cmd ⌘',
          '{metaright}': 'cmd ⌘',
          '{abc}': 'ABC',
        },
      });
    });
  }

  onChange = (input: string) => {
    this.inputForm.setValue({ partNumber: input });
  };

  onKeyPress = (button: string) => {
    if (button === '{shift}' || button === '{lock}') this.handleShift();
    if (button === '{numbers}' || button === '{abc}') this.handleNumbers();
  };

  handleShift(): void {
    const currentLayout = this.keyboard.options.layoutName;
    const shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
  }
  handleNumbers(): void {
    const currentLayout = this.keyboard.options.layoutName;
    const numbersToggle = currentLayout !== 'numbers' ? 'numbers' : 'default';

    this.keyboard.setOptions({
      layoutName: numbersToggle,
    });
  }

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  select(data: any): void {
    const input = data.ProductCode + data.PartNumber;
    this.keyboard.setInput(input);
    this.inputForm.setValue({ partNumber: input });
  }

  onSubmit(): void {
    this.keyboard.destroy();
    this._router.navigateByUrl('receiving/verify');
  }

  back(): void {
    this.keyboard.destroy();
    this._router.navigateByUrl('receiving');
  }
}
