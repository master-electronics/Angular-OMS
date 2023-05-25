import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { PopupModalComponent } from 'src/app/shared/ui/modal/popup-modal.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { StockingService } from '../../data/stocking.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    GreenButtonComponent,
    PopupModalComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        (clickSubmit)="notFound()"
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
    private _stock: StockingService
  ) {}

  public data$;
  public message;
  public unverifiedITNs = [...this._stock.ITNList];
  public verifiedITNs = [];
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.data$ = of(true);
  }

  onSubmit(): void {
    const input = this.inputForm.value.itn;
    this.inputForm.patchValue({ itn: '' });
    // IF ITN not in the list, then move this itn to user container
    if (!this._stock.ITNList.some((itn) => itn.ITN === input)) {
      this.moveItnToUser(input);
      return;
    }
    // If itn in the list, move this itn from unverified to verified list.
    this.unverifiedITNs = this.unverifiedITNs.filter((itn) => {
      const isequal = itn.ITN === input;
      if (isequal) {
        this.verifiedITNs.push(itn);
      }
      return !isequal;
    });
    this.data$ = of({
      error: {
        message: `ITN ${input} is found`,
        name: `success`,
      },
    });
  }

  private moveItnToUser(input): void {
    this.data$ = this._stock.moveItnToUser(input).pipe(
      map(() => ({
        error: {
          message: `${input} is not found in the working location,  It has been moved to your personal location.`,
          name: `warning`,
        },
      })),
      catchError((error) =>
        of({
          error: { message: error.message, name: 'error' },
        })
      )
    );
  }

  onBack(): void {
    this._router.navigate(['../itncount'], { relativeTo: this._actRoute });
  }

  onDone(): void {
    if (!this.unverifiedITNs.length) {
      this._stock.updateItnList(this.verifiedITNs);
      this._router.navigate(['../checkitns'], {
        relativeTo: this._actRoute,
      });
      return;
    }
    this.message = `You are about to declare ${this.unverifiedITNs.length} ITNs as NOT FOUND.
    Continue?`;
  }

  notFound(): void {
    const list = this.unverifiedITNs.map((itn) => ({
      ITN: itn.ITN,
      InventoryID: itn.InventoryID,
    }));
    this.data$ = this._stock.addNotFoundFlag$(list).pipe(
      map(() => {
        // check if current location is empty, back to first page.
        let url = '../checkitns';
        if (this.unverifiedITNs.length === this._stock.ITNList.length) {
          url = '../scantarget';
        }
        this._stock.updateItnList(this.verifiedITNs);
        this._router.navigate([url], {
          relativeTo: this._actRoute,
        });
      }),
      catchError((error) => {
        // check if current location is empty, back to first page.
        let url = '../checkitns';
        if (this.unverifiedITNs.length === this._stock.ITNList.length) {
          url = '../scantarget';
        }
        this._stock.updateItnList(this.verifiedITNs);
        this._router.navigate([url], {
          relativeTo: this._actRoute,
        });
        // return of({ error: { message: error.message, name: 'error' } });
        return of(false);
      })
    );
  }

  cancel(): void {
    this.message = null;
  }
}
