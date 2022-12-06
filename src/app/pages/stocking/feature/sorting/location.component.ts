import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, combineLatest, map, of } from 'rxjs';
import { PrinterButtomComponent } from 'src/app/shared/ui/button/print-button.component';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { SortingService } from '../../data/sorting';
import { SortingInfoComponent } from '../../ui/sorting-info.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    SortingInfoComponent,
    PrinterButtomComponent,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="location"
      title="Location"
    ></single-input-form>
    <ng-container *ngIf="info$ | async as info">
      <sorting-info [sortingInfo]="info"></sorting-info>
      <printer-button
        class=" absolute bottom-1 right-1"
        [ITN]="info.info.ITN"
      ></printer-button>
    </ng-container>
  `,
})
export class LocationComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _sort: SortingService
  ) {}

  public data$;
  public inputForm = this._fb.nonNullable.group({
    location: ['', [Validators.required]],
  });
  public info$ = combineLatest([
    this._sort.sortingInfo$.pipe(
      map((res) => ({
        ITN: res.ITN,
        ProductCode: res.ProductCode,
        PartNumber: res.PartNumber,
        Remaining: res.Remaining,
        ProductType: res.ProductType,
        Velocity: res.Velocity,
      }))
    ),
    this._actRoute.data.pipe(map((res) => res.locations)),
  ]).pipe(map(([info, locations]) => ({ info, locations })));

  ngOnInit() {
    this.data$ = of(true);
  }

  onSubmit(): void {
    const tmp = this.inputForm.value.location;
    const Barcode =
      tmp.trim().length === 16 ? tmp.trim().replace(/-/g, '') : tmp.trim();
    this.data$ = this._sort.moveItn$(Barcode).pipe(
      map(() => {
        this._router.navigate(['../itn'], { relativeTo: this._actRoute });
      }),
      catchError((error) => {
        return of({
          error: { message: error.message, type: 'error' },
        });
      })
    );
  }

  onBack(): void {
    this._router.navigate(['../itn'], { relativeTo: this._actRoute });
  }
}
