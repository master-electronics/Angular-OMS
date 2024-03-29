import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleKeyboardComponent } from '../../../../shared/ui/simple-keyboard.component';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { catchError, of, switchMap, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { LabelService } from '../../data/label';
import { kickoutService } from '../../data/kickout';
import { CreateReceiptService } from '../../data/createReceipt';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
    MessageBarComponent,
    GreenButtonComponent,
    RedButtonComponent,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [data]="data$ | async"
      [formGroup]="inputForm"
      inputType="number"
      controlName="receipt"
      title="Receipt"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <div
      class="grid h-16  grid-cols-3 text-2xl md:mx-16 md:mt-10 md:h-32 md:text-4xl"
    >
      <green-button buttonText="Create" (buttonClick)="create()"></green-button>
      <red-button
        class="col-start-3"
        buttonText="Kick out"
        (buttonClick)="onKickout()"
      ></red-button>
    </div>
  `,
})
export class ReceiptComponent implements OnInit {
  public inputForm: FormGroup;
  public data$;

  constructor(
    private _router: Router,
    private _ui: TabService,
    private _actRoute: ActivatedRoute
  ) {}

  _receipt = inject(ReceiptInfoService);
  _info = inject(updateReceiptInfoService);
  _label = inject(LabelService);
  _kickout = inject(kickoutService);
  _create = inject(CreateReceiptService);

  ngOnInit(): void {
    this._ui.changeSteps(0);
    this._create.reset();
    this._kickout.reset();
    this._label.reset();
    this._info.reset();
    this._receipt.resetAfterPart();
    this.inputForm = new FormGroup({
      receipt: new FormControl(null, [Validators.required]),
    });
    this.data$ = this._actRoute.queryParamMap;
  }

  public onChange = (input: string) => {
    this.inputForm.patchValue({ receipt: input });
  };

  public onBack(): void {
    this._router.navigate(['/home']);
  }

  public create(): void {
    this._router.navigate(['../purchasenumber'], {
      relativeTo: this._actRoute,
    });
  }

  onKickout(): void {
    this._router.navigate(['../kickoutitn'], {
      relativeTo: this._actRoute,
    });
  }

  public onSearch(): void {
    this._router.navigate(['../search'], {
      relativeTo: this._actRoute,
    });
  }

  public onSubmit(): void {
    if (!this.inputForm.value.receipt) {
      return;
    }
    this.data$ = this._receipt
      .checkReceiptHeader$(Number(this.inputForm.value.receipt))
      .pipe(
        tap(() => {
          this._router.navigate(['../part'], { relativeTo: this._actRoute });
        }),
        catchError((error) => {
          return of({
            error: { message: error.message, type: 'error' },
          });
        })
      );
  }
}
