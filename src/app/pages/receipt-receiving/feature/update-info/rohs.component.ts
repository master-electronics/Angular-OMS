import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Observable } from 'rxjs';
import { updateReceiptStore } from '../../data/updateReceipt';

@Component({
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  template: `
    <div class="flex flex-row justify-center">
      <div class="mt-8 h-12 w-32 rounded-md bg-green-300">
        <button nz-button nzSize="large" type="button" (click)="onUpdate(true)">
          YES
        </button>
      </div>
      <div class="mt-8 h-12 w-32 rounded-md bg-red-300">
        <button
          nz-button
          nzSize="large"
          type="button"
          (click)="onUpdate(false)"
        >
          NO
        </button>
      </div>
    </div>
    <button nz-button nzSize="large" type="button" (click)="onBack()">
      Back
    </button>
  `,
})
export class ROHSComponent {
  public update$: Observable<any>;

  constructor(private _router: Router, private _update: updateReceiptStore) {}

  onUpdate(ROHS: boolean): void {
    this._update.updateROHS(ROHS);
    this.update$;
    this._router.navigateByUrl('receiptreceiving/verify/rohs');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/verify/country');
  }
}
