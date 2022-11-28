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
import { PrinterService } from 'src/app/shared/data/printerInfo';
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
    <div class="mx-20 mt-4">
      <single-input-form
        (formSubmit)="onSubmit()"
        (formBack)="onBack()"
        [data]="data$ | async"
        [formGroup]="inputForm"
        inputType="number"
        controlName="printerID"
        title="Printer ID"
        placeholder="Scan the Printer QR Code!"
      ></single-input-form>
    </div>
  `,
})
export class PrinterSettingComponent implements OnInit {
  public data$;
  public inputForm: FormGroup = new FormGroup({
    printerID: new FormControl(null, [Validators.required]),
  });
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private printer: PrinterService
  ) {}

  ngOnInit(): void {
    this.data$ = of({ loading: false, error: null });
  }

  onSubmit(): void {
    this.data$ = this.printer
      .setPrinter$(Number(this.inputForm.value.printerID))
      .pipe(
        tap((res) => {
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || '/home';
          this.router.navigateByUrl(returnUrl);
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
    this.router.navigateByUrl('/home');
  }
}
