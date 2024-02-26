import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { OrderService } from '../data-access/order';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    SingleInputformComponent,
    CommonModule,
    ReactiveFormsModule,
  ],
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
export class ScanItnComponent {
  public data$;
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _order: OrderService
  ) {
    this.data$ = of(true);
    this._order.setItnInfo(null);
  }

  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  onSubmit(): void {
    if (!this.inputForm.value.itn) {
      return;
    }
    this.data$ = this._order.verifyQcItn$(this.inputForm.value.itn).pipe(
      map(() => {
        this._router.navigate(['../globalmessages'], {
          relativeTo: this._actRoute,
        });
      }),
      catchError((err) => {
        return of({
          error: { message: err, type: 'error' },
        });
      })
    );
  }

  onBack(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
