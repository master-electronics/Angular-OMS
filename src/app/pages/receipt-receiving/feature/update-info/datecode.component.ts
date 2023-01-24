import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DefalutDateCode } from 'src/app/shared/utils/dataRegex';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { TabService } from '../../data/tab';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { LogService } from '../../data/eventLog';
import { SingleInputformComponent } from '../../../../shared/ui/input/single-input-form.component';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';
import { catchError, map, of, tap } from 'rxjs';
import { Insert_UserEventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { sqlData } from 'src/app/shared/utils/sqlData';

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
      [validator]="validator"
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
      <red-button buttonText="Kickout" (buttonClick)="kickOut()"></red-button>
    </div>
    <simple-keyboard
      layout="number"
      [inputString]="inputForm.value.dateCode"
      (outputString)="onChange($event)"
    ></simple-keyboard>
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
  public validator = {
    name: 'dateCode',
    message: 'Format must be YYWW(2 digit year, 2 digit week)',
  };

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _ui: TabService,
    private _update: updateReceiptInfoService,
    private _inserlog: Insert_UserEventLogsGQL,
    private _log: LogService
  ) {}

  ngOnInit(): void {
    this._ui.changeSteps(2);
    this.data$ = of(true);
    this.inputForm = this._fb.group({
      dateCode: ['', [Validators.required, this.checkDateCode()]],
    });
  }

  public checkDateCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const isVaild = DefalutDateCode.test(value);
      return !isVaild ? { dateCode: true } : null;
    };
  }

  kickOut(): void {
    this._router.navigate(['../../kickout'], { relativeTo: this._actRoute });
  }

  passAuth(Supervisor: string): void {
    this.data$ = this._inserlog
      .mutate({
        log: [
          {
            ...this._log.receivingLog,
            UserEventID: sqlData.Event_Receiving_NotApplicable,
            Message: 'DateCode ' + Supervisor,
          },
        ],
      })
      .pipe(
        tap(() => {
          this._update.updateDateCode(null);
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

  kickout;

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/country');
  }
}
