import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { ASNService } from '../../data/asn.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PrinterService } from 'src/app/shared/data/printer';
import { combineLatest, of, switchMap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputTyep="string"
      controlName="ITN"
      title="Scan ITN to print ASN Label:"
    >
    </single-input-form>
  `,
})
export class ScanITN implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _asn: ASNService,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _printer: PrinterService
  ) {}

  public data$;
  public inputForm = this._fb.nonNullable.group({
    ITN: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.data$ = of(true);
  }

  public onSubmit(): void {
    const input = this.inputForm.value.ITN.trim();

    if (ITNBarcodeRegex.test(input)) {
      this.data$ = this._asn.fetchASN(input).pipe(
        switchMap((res) => {
          console.log(res);
          const asnId = res.data.findASNByITN[0]._id;
          return this._printer.printQRCode$(asnId.toString());
        })
      );
    } else {
      this.data$ = of({
        error: { message: 'Invalid ITN format', type: 'error' },
      });
    }
  }

  public onBack(): void {
    this._router.navigate(['../menu'], {
      relativeTo: this._actRoute,
    });
  }
}
