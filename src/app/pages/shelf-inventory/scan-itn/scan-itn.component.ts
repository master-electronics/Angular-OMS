import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ITNBarcodeRegex } from '../../../shared/dataRegex';
import { ShelfInventoryService } from '../shelf-inventory.server';

@Component({
  selector: 'sacn-itn',
  templateUrl: './scan-itn.component.html',
})
export class ScanITNComponent implements OnInit, AfterViewInit {
  alertType = 'error';
  alertMessage = '';
  totalITNs = 0;
  itemList = [];
  selectedList = [];
  invalidITN = [];

  inputForm = this._fb.group({
    ITNBarcode: [
      '',
      [Validators.required, Validators.pattern(ITNBarcodeRegex)],
    ],
  });

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _shelfInventoryService: ShelfInventoryService
  ) {}

  @ViewChild('ITNBarcode') ITNinput: ElementRef;
  ngOnInit(): void {
    this.itemList = this._shelfInventoryService.ITNList;
    if (!this.itemList) {
      this._router.navigate(['/shelfinventory']);
    } else {
      this.totalITNs = this.itemList.length;
    }
  }

  ngAfterViewInit(): void {
    this.ITNinput.nativeElement.select();
  }

  onSubmit(): void {
    this.alertMessage = '';
    if (!this.inputForm.valid) {
      this.ITNinput.nativeElement.select();
      return;
    }
    this.selectITN();
  }

  selectITN(): void {
    let isInList = false;
    this.itemList = this.itemList.filter((node) => {
      isInList = node === this.inputForm.get('ITNBarcode').value;
      if (isInList) {
        this.selectedList.push(node);
      }
      return !isInList;
    });

    if (!isInList) {
      isInList = this.selectedList.includes(
        this.inputForm.get('ITNBarcode').value
      );
    }

    if (!isInList) {
      const isInInvalidList = this.invalidITN.includes(
        this.inputForm.get('ITNBarcode').value
      );
      if (!isInInvalidList) {
        this.invalidITN.unshift(this.inputForm.get('ITNBarcode').value);
      }
    }

    if (this.totalITNs === this.selectedList.length) {
      this.alertType = 'success';
      this.alertMessage = 'All ITNs are scaned.';
    } else if (!isInList) {
      this.alertMessage = `This ITN is not in the list.`;
    }
    if (isInList) {
      this.inputForm.get('ITNBarcode').setValue('');
    }

    this.ITNinput.nativeElement.select();
    return;
  }

  back(): void {
    this._router.navigate(['/shelfinventory']);
  }
}
