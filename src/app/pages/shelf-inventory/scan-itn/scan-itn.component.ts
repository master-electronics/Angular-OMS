import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { ITNBarcodeRegex } from '../../../shared/utils/dataRegex';
import { ShelfInventoryService } from '../shelf-inventory.server';
import { NgIf, NgFor } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzFormModule } from 'ng-zorro-antd/form';

@Component({
  selector: 'sacn-itn',
  templateUrl: './scan-itn.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NzFormModule,
    ReactiveFormsModule,
    NzGridModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NzTableModule,
    NgIf,
    NgFor,
    RouterLink,
  ],
})
export class ScanITNComponent implements OnInit, AfterViewInit {
  itemList = [];
  selectedList = new Set();
  invalidITN = [];

  inputForm = this._fb.group({
    ITNBarcode: ['', [Validators.pattern(ITNBarcodeRegex)]],
  });

  constructor(
    private _fb: UntypedFormBuilder,
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
