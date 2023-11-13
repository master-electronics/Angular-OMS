import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { catchError, of } from 'rxjs';
import { PrinterService } from 'src/app/shared/data/printer';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SingleInputformComponent,
    NzSkeletonModule,
  ],
  template: `
    <div class="px-1 py-4">
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [formGroup]="inputForm"
        controlName="printerName"
        title="Printer"
        placeholder="Scan the printer's barcode!"
      ></single-input-form>
      <div *ngIf="data$ | async as data; else loading"></div>
      <ng-template #loading>
        <nz-skeleton
          [nzActive]="true"
          [nzParagraph]="{ rows: 8 }"
        ></nz-skeleton>
      </ng-template>
    </div>
  `,
})
export class ItnInfoComponent implements OnInit {
  public data$;
  public inputForm: FormGroup = new FormGroup({
    itn: new FormControl(null, [
      Validators.required,
      Validators.pattern(ITNBarcodeRegex),
    ]),
  });
  constructor(private router: Router, private printer: PrinterService) {}

  ngOnInit(): void {
    this.data$ = of(true);
  }

  onSubmit(): void {
    this.data$ = this.printer
      .setPrinter$(this.inputForm.value.printerName)
      .pipe(
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }

  onBack(): void {
    this.router.navigateByUrl('/home');
  }
}
