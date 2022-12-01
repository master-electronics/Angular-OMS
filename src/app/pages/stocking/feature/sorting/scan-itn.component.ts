import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { SortingService } from '../../data/sorting';

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
      title="ITN"
    ></single-input-form>
  `,
})
export class ScanITNComponent implements OnInit {
  public data$;
  public inputForm;
  constructor(
    private title: Title,
    private navbar: CommonService,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _sort: SortingService
  ) {}
  ngOnInit(): void {
    this.title.setTitle('Sorting');
    this.navbar.changeNavbar('Sorting');
    this.data$ = this._actRoute.queryParamMap;
    this.inputForm = new FormGroup({
      itn: new FormControl('', [
        Validators.required,
        Validators.pattern(ITNBarcodeRegex),
      ]),
    });
  }

  onSubmit(): void {
    this.data$ = this._sort.verifyITN$(this.inputForm.value.itn).pipe(
      map(() => {
        this._router.navigate(['../location'], { relativeTo: this._actRoute });
      }),
      catchError((error) => {
        return of({
          loading: false,
          error: { message: error.message, type: 'error' },
        });
      })
    );
  }

  onBack(): void {
    this._router.navigate(['../../'], { relativeTo: this._actRoute });
  }
}
