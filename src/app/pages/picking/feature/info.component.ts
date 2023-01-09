import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SingleInputformComponent],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      controlName="itn"
      title="ITN:"
    ></single-input-form>
  `,
})
export class InfoComponent {
  constructor(private _router: Router, private _actRoute: ActivatedRoute) {}
  public data$;

  onSubmit(): void {
    // this.data$ =
  }
  onBack(): void {
    this._router.navigate(['../itn'], { relativeTo: this._actRoute });
  }
}
