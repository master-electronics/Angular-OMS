import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, combineLatest, map, of, shareReplay, tap } from 'rxjs';
import { PrinterButtomComponent } from 'src/app/shared/ui/button/print-button.component';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ItnInfoService } from '../../data/itn-info.service';
import { SortingService } from '../../data/sorting.service';
import { SortInfoComponent } from '../../ui/sort-info.component';
import { SuggetionLocationComponent } from '../../ui/suggetion-location.component';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    PrinterButtomComponent,
    SortInfoComponent,
    SuggetionLocationComponent,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="location"
      title="Location:"
    ></single-input-form>
    <ng-container *ngIf="info$ | async as info">
      <sort-info
        [sortingInfo]="info.info"
        [Autostore]="info.autostore"
      ></sort-info>
      <suggetion-location [locations]="info.locations"></suggetion-location>
      <printer-button
        class=" absolute bottom-2 right-2 h-10 w-10"
        [ITN]="info.info.ITN"
        [PRODUCTCODE]="this.ProductCode"
        [PARTNUMBER]="info.info.PN"
      ></printer-button>
    </ng-container>
  `,
})
export class LocationComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _sort: SortingService,
    private _itn: ItnInfoService
  ) {}

  public data$;
  public ProductCode = '';
  public inputForm = this._fb.nonNullable.group({
    location: ['', [Validators.required]],
  });
  public info$ = combineLatest([
    toObservable(this._itn.itnInfo).pipe(
      tap((res) => (this.ProductCode = res.ProductCode)),
      map((res) => ({
        ITN: res.ITN,
        PN: res.PartNumber,
        PT: res.ProductType,
        Qty: res.QuantityOnHand,
        Vty: res.Velocity,
      }))
    ),
    toObservable(this._itn.itnInfo).pipe(
      map((res) => ({
        flag: res.Autostore,
      }))
    ),
    this._actRoute.data.pipe(map((res) => res.locations)),
  ]).pipe(
    map(([info, autostore, locations]) => ({ info, autostore, locations })),
    shareReplay(1)
  );

  ngOnInit() {
    this.data$ = of(true);
  }

  onSubmit(): void {
    const tmp = this.inputForm.value.location;
    const Barcode =
      tmp.trim().length === 16 ? tmp.trim().replace(/-/g, '') : tmp.trim();
    this.data$ = this._sort.moveItn$(Barcode).pipe(
      map(() => {
        this._router.navigate(['../verifysorting'], {
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

  onBack(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
