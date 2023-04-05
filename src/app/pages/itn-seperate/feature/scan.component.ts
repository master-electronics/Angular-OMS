import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { CommonService } from 'src/app/shared/services/common.service';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { ItnSeperateService } from '../data/itn-seperate.service';

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
      title="ITN:"
    ></single-input-form>
  `,
})
export class ScanComponent implements OnInit {
  constructor(
    private title: Title,
    private navbar: CommonService,
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _itn: ItnSeperateService,
    private _eventLog: EventLogService
  ) {}

  public data$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.title.setTitle('Sorting');
    this.navbar.changeNavbar('Sorting');
    this.data$ = of(true);
    this._itn.resetItnInfo();
    this._eventLog.initEventLog(null);
  }

  onSubmit(): void {
    this.data$ = this._sort.verifyITN$(this.inputForm.value.itn).pipe(
      map(() => {
        this._router.navigate(['../location'], {
          relativeTo: this._actRoute,
          queryParams: { ProductID: this._itn.itnInfo.ProductID },
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
