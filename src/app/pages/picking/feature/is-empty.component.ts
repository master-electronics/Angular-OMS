import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SingleInputformComponent],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="quantity"
      title="Quantity:"
      inputType="number"
    ></single-input-form>
  `,
})
export class IsEmptyComponent {
  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _fb: FormBuilder
  ) {}
  public data$;
  public inputForm = this._fb.nonNullable.group({
    quantity: ['', [Validators.required]],
  });

  onSubmit(): void {
    // this.data$ =
  }
  onBack(): void {
    this._router.navigate(['../../'], { relativeTo: this._actRoute });
  }
}
