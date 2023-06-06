import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { ItnInfoService } from '../../../data/itn-info.service';
import { SortingService } from '../../../data/sorting.service';
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
      title="Scan ITN: {{ _stock.verifiedItns?.length + 1 }} of {{
        _stock.ITNList.length
      }}"
    ></single-input-form>
  `,
})
export class ScanItnComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    public _stock: StockingService,
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
    const input = this.inputForm.value.itn;
    /**
     * Search itn in the location itn list, If found unpdate current itn.
     * Then go to location page.
     */
    let tmp;
    const isInList = this._stock.ITNList.some((itn, index) => {
      if (itn.ITN === input) {
        tmp = itn;
        return true;
      }
      return false;
    });
    if (isInList) {
      this.data$ = this._stock.verifyITN$(input).pipe(
        map(() => {
          this._stock.addVerifiedItns(tmp);
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
    // if not move this non found itn to user container.
    this.inputForm.patchValue({ itn: '' });
    this.data$ = this._stock.moveItnToUser(input).pipe(
      map(() => ({
        error: {
          message: `${input} is not found in the working location. It has been moved to your personal location.`,
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
