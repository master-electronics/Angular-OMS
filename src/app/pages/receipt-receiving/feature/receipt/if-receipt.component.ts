import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { TabService } from '../../../../shared/ui/step-bar/tab';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MessageBarComponent,
    RedButtonComponent,
    GreenButtonComponent,
  ],
  template: `
    <div class="flew justify-center gap-2 md:gap-6 lg:gap-12">
      <h1 class="text-4xl">Does Receipt ID exist?</h1>
      <div
        class="grid h-32 grid-cols-2 justify-center gap-4 text-4xl md:gap-10 lg:gap-16"
      >
        <green-button
          buttonText="Yes"
          (buttonClick)="gotoReceiptID()"
        ></green-button>
        <red-button buttonText="No" (buttonClick)="gotoGenerate()"></red-button>
      </div>

      <div *ngIf="update$ | async as data">
        <message-bar *ngIf="data.message"></message-bar>
      </div>
    </div>
  `,
})
export class IfReceiptComponent implements OnInit {
  public update$: Observable<any>;

  constructor(private _router: Router, private _steps: TabService) {}

  ngOnInit(): void {
    this._steps.changeSteps(0);
  }

  public gotoGenerate() {
    this._router.navigateByUrl('receiptreceiving/generatereceipt');
  }

  public gotoReceiptID() {
    this._router.navigateByUrl('receiptreceiving/receipt');
  }

  public onBack(): void {
    this._router.navigateByUrl('home');
  }
}
