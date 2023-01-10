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
    <picking-info [info]="_picking.itnInfo" [MIC]="MIC" ]></picking-info>
    <div>
      <normal-button
        (buttonClick)="updatePhoto()"
        title="Update Photo"
      ></normal-button>
      <normal-button
        (buttonClick)="updateProductType()"
        title="Update Type"
      ></normal-button>
      <red-button></red-button>
      <red-button></red-button>
    </div>
    <div>
      <submit-button></submit-button>
      <normal-button></normal-button>
    </div>
  `,
})
export class InfoComponent implements OnInit {
  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    public _picking: PickingService
  ) {}
  public data$;
  public MIC: string;

  ngOnInit(): void {
    this.data$ = of(true);
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
