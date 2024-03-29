import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';
import { of, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    RedButtonComponent,
    NormalButtonComponent,
    SimpleKeyboardComponent,
    AuthModalComponent,
  ],
  template: `
    <single-input-form
      (formSubmit)="onSubmit()"
      (formBack)="onBack()"
      [validators]="validators"
      [formGroup]="inputForm"
      [data]="data$ | async"
      inputType="number"
      controlName="dateCode"
      title="Date Code"
      [isvalid]="this.inputForm.valid"
    ></single-input-form>
    <div
      class="grid h-16  grid-cols-3 text-2xl md:mx-16 md:mt-10 md:h-32 md:text-4xl"
    >
      <normal-button
        buttonText="Not Applicable"
        (buttonClick)="this.popup = true"
      ></normal-button>
      <div></div>
    </div>
    <!-- <simple-keyboard
      layout="number"
      [inputString]="inputForm.value.dateCode"
      (outputString)="onChange($event)"
    ></simple-keyboard> -->
    <ng-container *ngIf="popup">
      <auth-modal
        message="Allow Empty DateCode!"
        (clickClose)="this.popup = false"
        (passAuth)="passAuth($event)"
      ></auth-modal>
    </ng-container>
  `,
})
export class DateCodeComponent implements OnInit {
  public inputForm: FormGroup;
  public popup = false;
  public data$;
  public validators = [
    {
      name: 'format',
      message: 'Format must be YYWW(2 digit year, 2 digit week)',
    },
    {
      name: 'value',
      message: `Input can't greater than current date!`,
    },
  ];

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _ui: TabService,
    private _update: updateReceiptInfoService
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(2);
    this.data$ = of(true);
    this.inputForm = this._fb.group({
      dateCode: ['', [Validators.required, this._update.checkDateCode()]],
    });
  }

  passAuth(Supervisor: string): void {
    this.data$ = this._update
      .passAuthForNotApplicable$(Supervisor, 'datecode')
      .pipe(
        tap(() => {
          this._update.updateDateCode(' ');
          this._router.navigateByUrl('receiptreceiving/update/ROHS');
        })
      );
  }

  onChange = (input: string) => {
    this.inputForm.get('dateCode').setValue(input);
  };

  onSubmit(): void {
    this._update.updateDateCode(this.inputForm.value.dateCode);
    this._router.navigateByUrl('receiptreceiving/update/ROHS');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/country');
  }
}
