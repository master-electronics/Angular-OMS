import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { PrinterService } from 'src/app/shared/data/printer';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';

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
        controlName="printerName"
        title="Printer"
        placeholder="Scan the printer's barcode!"
      ></single-input-form>
    </div>
  `,
})
export class PrinterSettingComponent implements OnInit {
  public data$;
  public inputForm: FormGroup = new FormGroup({
    printerName: new FormControl(null, [Validators.required]),
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private printer: PrinterService
  ) {}

  ngOnInit(): void {
    this.data$ = of(true);
  }

  onSubmit(): void {
    this.data$ = this.printer
      .setPrinter$(this.inputForm.value.printerName)
      .pipe(
        tap((res) => {
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || '/home';
          this.router.navigateByUrl(returnUrl);
        }),
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
