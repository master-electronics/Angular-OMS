import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { MoveItnService } from '../data/move-to-personal.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    SingleInputformComponent,
    ReactiveFormsModule,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="itn"
      title="Move ITN To Personal:"
    ></single-input-form>
  `,
})
export class MoveToUserComponent {
  private _fb = inject(FormBuilder);
  private _router = inject(Router);
  private _actRoute = inject(ActivatedRoute);
  private _move = inject(MoveItnService);

  public data$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });
  constructor() {
    this.data$ = of(true);
  }

  onSubmit(): void {
    if (this.inputForm.invalid) {
      return;
    }
    const itn = this.inputForm.value.itn.trim();
    this.data$ = this._move.moveItnToPersonal$(itn).pipe(
      map(() => ({
        error: {
          message: `Move ${itn} to Personal Container.`,
          name: 'success',
        },
      })),
      catchError((error) => {
        return of({
          error: { message: error.message, name: 'error' },
        });
      })
    );
  }

  onBack(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
