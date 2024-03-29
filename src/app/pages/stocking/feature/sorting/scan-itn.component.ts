import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { ItnInfoService } from '../../data/itn-info.service';
import { SortingService } from '../../data/sorting.service';
import { NavbarTitleService } from 'src/app/shared/services/navbar-title.service';

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
      title="ITN:"
    ></single-input-form>
  `,
})
export class ScanITNComponent implements OnInit {
  constructor(
    private title: Title,
    private _title: NavbarTitleService,
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _sort: SortingService,
    private _itn: ItnInfoService,
    private _eventLog: EventLogService
  ) {}

  public data$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.title.setTitle('Sorting');
    this._title.update('Sorting');
    this.data$ = of(true);
    this._itn.reset();
    this._eventLog.initEventLog(null);
  }

  onSubmit(): void {
    this.data$ = this._sort.sortingStart$(this.inputForm.value.itn).pipe(
      map(() => {
        this._router.navigate(['../location'], {
          relativeTo: this._actRoute,
          queryParams: { ProductID: this._itn.itnInfo().ProductID },
        });
      }),
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
