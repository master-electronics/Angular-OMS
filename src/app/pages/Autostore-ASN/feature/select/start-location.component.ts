import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { VerifyAsnLocationCreateGQL } from 'src/app/graphql/autostoreASN.graphql-gen';

@Component({
  standalone: true,
  imports: [CommonModule, SingleInputformComponent, ReactiveFormsModule],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="location"
      title="Scan Start Location:"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
  `,
})
export class ASNStartLocation implements OnInit {
  constructor(
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _fb: FormBuilder,
    private _findContainer: VerifyAsnLocationCreateGQL
  ) {}

  public data$;
  public log$;
  public inputForm = this._fb.nonNullable.group({
    location: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.data$ = of(true);
    sessionStorage.removeItem('asnLocation');
  }

  public onSubmit(): void {
    this.data$ = this._findContainer
      .fetch(
        {
          container: {
            Barcode: this.inputForm.value.location.toString(),
          },
        },
        { fetchPolicy: 'network-only' }
      )
      .pipe(
        tap((res) => {
          if (!res.data.findContainer) {
            throw new Error("Can't find this location!");
          }

          if (res.data.findContainer.ContainerType.IsMobile) {
            throw new Error("Can't select mobile location!");
          }

          sessionStorage.setItem(
            'asnLocation',
            res.data.findContainer.Barcode.toString()
          );

          this._router.navigate(['../scan-itn'], {
            relativeTo: this._actRoute,
          });
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }

  onBack() {
    this._router.navigate(['../menu'], {
      relativeTo: this._actRoute,
    });
  }
}
