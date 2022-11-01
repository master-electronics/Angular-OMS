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
      PartNumber: 'wuzy',
      ProductCode: 'abc',
    },
    {
      PartNumber: 'uudi',
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
        return part.PartNumber.toLowerCase() === value.toLowerCase();
      });
      return !isVaild ? { partNumberSearch: true } : null;
    };
  }

  ngOnInit(): void {
    this._service.changeTab(1);
  }

  ngAfterViewInit() {
    //
  }

  onChange = (input: string) => {
    this.inputForm.setValue({ partNumber: input });
  };

  select(data: any): void {
    const input = data.ProductCode + data.PartNumber;
    this.keyboard.setInput(input);
    this.inputForm.setValue({ partNumber: input });
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiving/verify');
  }

  back(): void {
    this._router.navigateByUrl('receiving');
  }
}
