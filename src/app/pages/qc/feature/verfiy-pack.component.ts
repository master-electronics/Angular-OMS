import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VerifyInfoComponent } from '../ui/verify-info.component';
import { OrderService } from '../data-access/order';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, VerifyInfoComponent],
  template: `
    <verify-info
      [imgUrl]="imgUrl"
      [itnInfo]="order.itnInfo"
      [HML]=""
      [productUrl]=""
      [specSheetUrl]=""
    ></verify-info>
    <div class="divider">Order Detail</div>
    <div class="divider">Count</div>
  `,
})
export class VerifyComponent {
  public data;
  public imgUrl = 'https://www.onlinecomponents.com/images/parts/largeimages/';
  constructor(
    private _actRoute: ActivatedRoute,
    private _router: Router,
    public order: OrderService
  ) {
    this.data = this._actRoute.data.pipe();
  }

  onSubmit(): void {
    //
  }

  onBack(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
