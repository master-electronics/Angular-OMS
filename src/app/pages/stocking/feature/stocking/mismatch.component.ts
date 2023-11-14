import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { StockingService } from '../../data/stocking.service';
import { ItnInfoService } from '../../data/itn-info.service';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    GreenButtonComponent,
    PopupModalComponent,
  ],
  template: `
    <h1 class="flex justify-center font-bold text-red-500 lg:text-4xl">
      ITN Count Mismatch
    </h1>
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      controlName="itn"
      title="Scan ITN:"
    ></single-input-form>
    <div
      class="absolute bottom-5 grid  h-12 w-full grid-cols-3 text-base sm:h-16 md:mx-16 md:mt-6 md:h-24  md:text-2xl lg:bottom-10 lg:h-36 lg:text-4xl"
    >
      <green-button
        class="col-span-2"
        buttonText="Done"
        (buttonClick)="onDone()"
      ></green-button>
    </div>
    <ng-container *ngIf="message">
      <popup-modal
        [message]="message"
        (clickSubmit)="popSubmit()"
        (clickCancel)="cancel()"
      ></popup-modal>
    </ng-container>
  `,
})
export class MismatchComponent implements OnInit {
  constructor(
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _stock: StockingService,
    private _itn: ItnInfoService
  ) {}

  public data$;
  public message;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.data$ = of(true);
  }

  onSubmit(): void {
    const input = this.inputForm.value.itn.trim();
    this.inputForm.patchValue({ itn: '' });
    const itnInfo = this._stock.ITNList().find((itn) => itn.ITN === input);
    // IF ITN not in the list, popout a windown, then move this itn to user container
    if (!itnInfo) {
      this.message = `${input} is not found, do you want to move it to your personal container?`;
      return;
    }
    // If itn in the list, move this itn from unverified to verified list.
    this._stock.addVerifiedItns(itnInfo);
    this.data$ = of({
      error: {
        message: `ITN ${input} is found`,
        name: `success`,
      },
    });
  }

  private moveItnToUser(itn: string): void {
    this.data$ = this._itn.verifyITN$(itn).pipe(
      switchMap(() => {
        return this._stock.moveItnToUser(itn);
      }),
      tap(() => (this.message = null)),
      map(() => ({
        error: {
          message: `${itn} is not found in the working location,  It has been moved to your personal location.`,
          name: `warning`,
        },
      })),
      catchError((error) => {
        this.message = null;
        return of({
          error: { message: error.message, name: 'error' },
        });
      })
    );
  }

  onBack(): void {
    this._router.navigate(['../itncount'], { relativeTo: this._actRoute });
  }

  onDone(): void {
    const verified = this._stock.verifiedItns()?.length || 0;
    const total = this._stock.ITNList().length;
    if (verified === total) {
      this._router.navigate(['../checkitns'], {
        relativeTo: this._actRoute,
      });
      return;
    }
    this.message = `You are about to declare ${
      total - verified
    } ITNs as NOT FOUND.
    Continue?`;
  }

  popSubmit() {
    if (this.message.substring(0, 3) === 'You') {
      this.notFound();
      return;
    }
    this.moveItnToUser(this.message.substring(0, 10));
  }

  notFound(): void {
    let notFound;
    if (!this._stock.verifiedItns()?.length) {
      notFound = this._stock.ITNList();
    } else {
      notFound = this._stock.ITNList().filter((total) => {
        return !this._stock
          .verifiedItns()
          .some((verify) => verify.ITN === total.ITN);
      });
    }
    this.data$ = this._stock.addNotFoundFlag$(notFound).pipe(
      map(() => {
        // check if current location is empty, back to first page.
        let url = '../checkitns';
        if (!this._stock.verifiedItns()?.length) {
          url = '../scantarget';
        }
        this._router.navigate([url], {
          relativeTo: this._actRoute,
        });
      }),
      catchError((error) => {
        let url = '../checkitns';
        if (!this._stock.verifiedItns()?.length) {
          url = '../scantarget';
        }
        this._router.navigate([url], {
          relativeTo: this._actRoute,
        });
        return of({ error: { message: error.message, name: 'error' } });
      })
    );
  }

  cancel(): void {
    this.message = null;
  }
}
