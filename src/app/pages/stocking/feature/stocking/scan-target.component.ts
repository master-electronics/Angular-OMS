import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { StockingService } from '../../data/stocking.service';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';
import { ItnInfoService } from '../../data/itn-info.service';

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
      title="Scan Location or ITN:"
    ></single-input-form>
  `,
})
export class ScanTargetComponent implements OnInit {
  constructor(
    private title: Title,
    private _title: NavbarTitleService,
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _stock: StockingService,
    private _itn: ItnInfoService
  ) {}

  public data$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.title.setTitle('Stocking');
    this._title.update('Stocking');
    this.data$ = this._actRoute.data.pipe(map((res) => res.containerID));
    this._stock.reset();
  }

  onSubmit(): void {
    const input = this.inputForm.value.itn.trim();
    if (ITNBarcodeRegex.test(input)) {
      this.moveItnToUser(input);
      return;
    }
    const Barcode =
      input.trim().length === 16
        ? input.trim().replace(/-/g, '')
        : input.trim();
    this.findITNInLocation(input);
  }

  private moveItnToUser(ITN: string) {
    this.data$ = this._itn.verifyITN$(ITN).pipe(
      switchMap(() => {
        return this._stock.moveItnToUser(ITN);
      }),
      map(() => {
        this._stock.ScanITNasTarget(ITN);
        this._router.navigate(['../putaway'], {
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

  private findITNInLocation(location: string) {
    this.data$ = this._stock.findITNsInLocation(location).pipe(
      map(() => {
        this._router.navigate(['../itncount'], { relativeTo: this._actRoute });
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
