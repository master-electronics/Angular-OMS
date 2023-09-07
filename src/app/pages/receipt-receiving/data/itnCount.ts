import { Injectable, inject, signal } from '@angular/core';
import { ReceiptInfoService } from './ReceiptInfo';

@Injectable()
export class ItnCountService {
  receipt = inject(ReceiptInfoService);

  private _itnCount = signal<number>(0);

  get itnCount() {
    return this._itnCount();
  }

  update(count: number) {
    this._itnCount.set(count);
  }

  private _quantityList = signal<number[]>([]);

  getQuantityList() {
    const result = [];
    const total = this.receipt.selectedReceiptLine[0].ExpectedQuantity;
    const count = this._itnCount();
    const quotient = Math.floor(total / count);
    const remainder = total % this._itnCount();
    // add the quotient to the result array `parts` times
    for (let i = 0; i < count; i++) {
      result.push(quotient);
    }
    // distribute the remainder across the result array
    for (let i = 0; i < remainder; i++) {
      result[i]++;
    }
    this._quantityList.set(result);
    return result;
  }
}
