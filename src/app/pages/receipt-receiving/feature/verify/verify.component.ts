import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, Observable, of, map } from 'rxjs';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { ReceiptPartInfoComponent } from '../../ui/receipt-part-info.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SubmitButtonComponent,
    NgOptimizedImage,
    NormalButtonComponent,
    RedButtonComponent,
    ReceiptPartInfoComponent,
  ],
  template: `
    <div *ngIf="data$ | async as info" class="grid grid-cols-2">
      <img width="600" height="600" [ngSrc]="info.MIC" priority />
      <receipt-part-info [info]="info"></receipt-part-info>
    </div>
    <div
      class="grid h-16 grid-cols-4 gap-6 text-2xl md:mt-10 md:h-24 md:text-4xl lg:h-36"
    >
      <red-button (buttonClick)="kickOut()" buttonText="Kick Out"></red-button>
      <div></div>
      <submit-button (buttonClick)="onSubmit()" buttonText="Verify">
      </submit-button>
      <normal-button (buttonClick)="onBack()"></normal-button>
    </div>
  `,
})
export class VerifyComponent implements OnInit {
  public data$: Observable<any>;

  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _step: TabService
  ) {}

  ngOnInit(): void {
    this._step.changeSteps(1);
    this.data$ = this._actRoute.data.pipe(
      map((res) => {
        return res.info;
      }),
      catchError((error) =>
        of({ isLoading: false, message: error.message, messageType: 'error' })
      )
    );
  }

  kickOut(): void {
    this._router.navigateByUrl('receiptreceiving/kickout');
  }

  onSubmit(): void {
    this._router.navigateByUrl('receiptreceiving/part/quantity');
  }

  onBack(): void {
    this._router.navigateByUrl('receiptreceiving/part');
  }
}
