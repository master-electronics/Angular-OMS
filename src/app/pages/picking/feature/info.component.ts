import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
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
    SubmitButtonComponent,
    RedButtonComponent,
    NormalButtonComponent,
  ],
  template: `
    <div>
      <normal-button
        (buttonClick)="updatePhoto()"
        buttonText="Update Photo"
      ></normal-button>
      <normal-button
        (buttonClick)="updateProductType()"
        buttonText="Update Type"
      ></normal-button>
      <red-button></red-button>
      <red-button></red-button>
    </div>
    <div>
      <submit-button></submit-button>
      <normal-button></normal-button>
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
    // this.data$ =
  }

  onBack(): void {
    this._router.navigate(['../itn'], { relativeTo: this._actRoute });
  }
}
