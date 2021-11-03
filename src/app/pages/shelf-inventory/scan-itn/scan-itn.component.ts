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
  itemList = [];
  selectedList = new Set();
  invalidITN = [];

  inputForm = this._fb.group({
    ITNBarcode: ['', [Validators.pattern(ITNBarcodeRegex)]],
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
    }
  }

  ngAfterViewInit(): void {
    this.ITNinput.nativeElement.select();
  }

  onSubmit(): void {
    if (!this.inputForm.valid || this.inputForm.value.ITNBarcode.length < 1) {
      this.ITNinput.nativeElement.select();
      return;
    }
    this.selectITN();
  }

  selectITN(): void {
    let isInList = false;
    const barcode = this.inputForm.value.ITNBarcode.toUpperCase();
    this.itemList = this.itemList.filter((node) => {
      isInList = node === barcode;
      if (isInList) {
        this.selectedList.add(node);
      }
      return !isInList;
    });

    if (!isInList) {
      isInList = this.selectedList.has(barcode);
    }

    if (!isInList) {
      const isInInvalidList = this.invalidITN.includes(barcode);
      if (!isInInvalidList) {
        this.invalidITN.unshift(barcode);
      }
    }

    this.ITNinput.nativeElement.select();
    return;
  }

  back(): void {
    this._router.navigate(['/shelfinventory']);
  }
}
