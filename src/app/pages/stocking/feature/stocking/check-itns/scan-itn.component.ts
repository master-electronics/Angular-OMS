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
    <h1 class="flex justify-center text-xl font-bold lg:text-4xl">Put Away</h1>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="itn"
      title="Scan ITN: {{ _stock.checkedItns()?.length + 1 }} of {{
        _stock.verifiedItns().length
      }}"
    ></single-input-form>
  `,
})
export class ScanItnComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    public _stock: StockingService
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
    /**
     * Search itn in the  verifieditn list, If found unpdate current itn.
     * Then go to location page.
     */
    const itnInfo = this._stock.verifiedItns().find((itn) => itn.ITN === input);
    if (itnInfo) {
      this.data$ = this._stock.verifyITN$(input).pipe(
        map(() => {
          this._router.navigate(['../putaway'], {
            relativeTo: this._actRoute,
          });
        }),
        catchError((error) =>
          of({
            error: { message: error.message, name: 'error' },
          })
        )
      );
      return;
    }
    // pop out warning message if not in list.
    this.inputForm.patchValue({ itn: '' });
    this.data$ = of(true).pipe(
      map(() => ({
        error: {
          message: `${input} is not in the working location.`,
          name: `warning`,
        },
      })),
      catchError((error) =>
        of({
          error: { message: error.message, name: 'error' },
        })
      )
    );
  }

  onBack(): void {
    // this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
