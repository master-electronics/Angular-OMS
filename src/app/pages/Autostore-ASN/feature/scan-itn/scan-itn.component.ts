import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import {
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { ASNService } from '../../data/asn.service';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    GreenButtonComponent,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      iputType="string"
      controlName="ITN"
      title="Scan ITN:"
    >
    </single-input-form>
    <div class="text-base sm:text-lg md:mx-16 md:text-2xl lg:text-4xl">
      <div
        class="grid h-12 w-full grid-cols-4 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      ></div>
      <div
        class="grid h-12 w-full grid-cols-4 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      ></div>
      <div
        class="grid h-12 w-full grid-cols-4 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      >
        <div></div>
        <div class="col-span-2">
          <green-button
            buttonText="Send to Autostore"
            (buttonClick)="sendToAutostore()"
          >
          </green-button>
        </div>
        <div></div>
      </div>
    </div>
    <div *ngIf="test$ | async"></div>
  `,
})
export class ScanITN implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _asn: ASNService,
    private _actRoute: ActivatedRoute,
    private _router: Router
  ) {}

  public data$;
  public test$;
  public inputForm = this._fb.nonNullable.group({
    ITN: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.data$ = this._actRoute.queryParamMap;
  }

  public onSubmit(): void {
    const input = this.inputForm.value.ITN.trim();
    console.log(input);
    if (ITNBarcodeRegex.test(input)) {
      this.moveItnToUser(input);
      return;
    } else {
      this.data$ = of({
        error: { message: 'Invalid ITN format', type: 'error' },
      });
    }
  }

  private moveItnToUser(ITN: string) {
    this.data$ = this._asn.moveItnToUser(ITN).pipe(
      map(() => {
        this._router.navigate(['../scan-location'], {
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

  sendToAutostore() {
    this._router.navigate(['../create/scan-location'], {
      relativeTo: this._actRoute,
    });
  }
}
