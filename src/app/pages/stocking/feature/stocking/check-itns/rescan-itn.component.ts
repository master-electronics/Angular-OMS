import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { ItnInfoService } from '../../../data/itn-info.service';
import { StockingService } from '../../../data/stocking.service';

@Component({
  standalone: true,
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
      title="Rescan the ITN:"
    ></single-input-form>
  `,
})
export class RescanItnComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _stock: StockingService,
    private _itn: ItnInfoService
  ) {}

  public data$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.data$ = of(true);
  }

  onSubmit(): void {
    const input = this.inputForm.value.itn.trim();
    // if not equal pop out error
    if (input !== this._itn.itnInfo().ITN) {
      this.data$ = of({ error: { message: `Invalid ITN!`, name: `error` } });
      return;
    }
    // if equal move itn to destination, then push itn to checked itn list.
    this.data$ = this._stock.putAway$().pipe(
      map(() => {
        if (
          this._stock.verifiedItns()?.length !==
          this._stock.checkedItns()?.length
        ) {
          this._router.navigate(['../checkitns'], {
            relativeTo: this._actRoute,
          });
          return;
        }
        this._router.navigate(['../user'], { relativeTo: this._actRoute });
      }),
      catchError((error) => {
        return of({
          error: { message: error.message, type: 'error' },
        });
      })
    );
  }

  onBack(): void {
    // this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
