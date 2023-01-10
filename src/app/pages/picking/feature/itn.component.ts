import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { PickingService } from '../data/picking.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SingleInputformComponent],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="itn"
      title="ITN:"
    ></single-input-form>
  `,
})
export class ItnComponent implements OnInit {
  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _picking: PickingService
  ) {}
  public data$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.data$ = of(true);
  }

  onSubmit(): void {
    this.data$ = this._picking.fetchItnInfo$(this.inputForm.value.itn).pipe(
      tap(() => {
        this._router.navigate(['../info'], { relativeTo: this._actRoute });
      }),
      catchError((error) => {
        return of({
          error: { message: error.message, type: 'error' },
        });
      })
    );
  }

  onBack(): void {
    this._router.navigate(['../../'], { relativeTo: this._actRoute });
  }
}
