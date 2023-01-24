import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { PickingService } from '../data/picking.service';
import { PickingInfoComponent } from '../ui/part-info.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    PickingInfoComponent,
    GreenButtonComponent,
    SubmitButtonComponent,
    RedButtonComponent,
    NormalButtonComponent,
  ],
  template: `
    <div class="grid grid-cols-2 gap-2">
      <green-button
        (buttonClick)="updatePhoto()"
        buttonText="Update Photo"
      ></green-button>
      <green-button
        (buttonClick)="updateProductType()"
        buttonText="Update Type"
      ></green-button>
      <submit-button (buttonClick)="onSubmit()"></submit-button>
      <normal-button (buttonClick)="onBack()"></normal-button>
      <red-button buttonText="Kickout"></red-button>
    </div>
    <picking-info [info]="info" [MIC]="_picking.itnInfo.MIC"></picking-info>
  `,
})
export class InfoComponent implements OnInit {
  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    public _picking: PickingService
  ) {}
  public data$;
  public info;

  ngOnInit(): void {
    this.data$ = of(true);
    this.info = {
      Order:
        this._picking.itnInfo.OrderNumber +
        '-' +
        this._picking.itnInfo.NOSINumber,
      ProductType: this._picking.itnInfo.ProductType || '',
      PartNumber: this._picking.itnInfo.PartNumber,
      ProductCode: this._picking.itnInfo.ProductCode,
      Unit: this._picking.itnInfo.Unit,
      Message: this._picking.itnInfo.GlobaleMessage,
    };
  }

  updatePhoto(): void {
    //
  }

  updateProductType(): void {
    //
  }

  onSubmit(): void {
    this._router.navigate(['../quantity'], { relativeTo: this._actRoute });
  }

  onBack(): void {
    this._router.navigate(['../itn'], { relativeTo: this._actRoute });
  }
}
