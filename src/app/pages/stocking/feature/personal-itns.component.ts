import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { ItnListComponent } from '../ui/itn-list.component';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ItnInfoService } from '../data/itn-info.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ItnListComponent,
    SingleInputformComponent,
    ReactiveFormsModule,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [formGroup]="inputForm"
      controlName="username"
      inputType="text"
      title="Input User Name"
    ></single-input-form>
    <itn-list [ItnList]="data$ | async"></itn-list>
  `,
})
export class PersonalItnsComponent {
  public data$;

  inputForm = this._fb.nonNullable.group({
    username: ['', [Validators.required]],
  });
  constructor(
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _fb: FormBuilder,
    private _itn: ItnInfoService
  ) {}

  onSubmit(): void {
    const username = this.inputForm.get('username').value;
    this.data$ = this._itn.personalItns$(username).pipe(
      catchError((error) => {
        return of({
          error: { message: error.message, type: 'error' },
        });
      })
    );
  }

  onBack(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
