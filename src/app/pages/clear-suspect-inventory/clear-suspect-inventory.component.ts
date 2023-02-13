import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { ClearSuspectInventoryGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { PrinterService } from 'src/app/shared/data/printer';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { environment } from 'src/environments/environment';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SingleInputformComponent,
  ],
  template: `
    <div class="px-1 py-4">
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
        [formGroup]="inputForm"
        controlName="ITN"
        title="Scan ITN"
        placeholder="Clear the suspect ITN"
      ></single-input-form>
    </div>
  `,
})
export class ClearSuspectInventoryComponent implements OnInit {
  public data$;
  public inputForm: FormGroup = new FormGroup({
    ITN: new FormControl(null, [
      Validators.required,
      Validators.pattern(ITNBarcodeRegex),
    ]),
  });
  constructor(
    private router: Router,
    private clearSuspect: ClearSuspectInventoryGQL
  ) {}

  ngOnInit(): void {
    this.data$ = of(true);
  }

  onSubmit(): void {
    this.data$ = this.clearSuspect
      .mutate({
        DC: environment.DistributionCenter,
        ITN: this.inputForm.value.ITN,
      })
      .pipe(
        map((res) => {
          return {
            error: {
              message: `Clear suspect ${this.inputForm.value.ITN}`,
              name: 'success',
            },
          };
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, name: 'error' },
          });
        })
      );
  }

  onBack(): void {
    this.router.navigateByUrl('/home');
  }
}
