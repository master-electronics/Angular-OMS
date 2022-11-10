import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ReceivingService } from '../../data/receiving.server';

@Component({
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase-order.component.html',
})
export class PurchaseOrderComponent {
  public data$: Observable<any>;

  constructor(private _router: Router, private _service: ReceivingService) {
    this.data$ = this._service.getReceiptHInfo();
  }

  public onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/kickout/part');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }
}
