import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { LogService } from '../../data/eventLog';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { LabelService } from '../../data/label';
import { RedButtonComponent } from 'src/app/shared/ui/button/red-button.component';
import { kickoutService } from '../../data/kickout';
import { Logger } from 'src/app/shared/services/logger.service';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    SimpleKeyboardComponent,
    NzSkeletonModule,
    MessageBarComponent,
    RedButtonComponent,
    GreenButtonComponent,
  ],
  template: `
    <form
      *ngIf="print$ | async as print; else loading"
      [formGroup]="selectITN"
      (ngSubmit)="skip()"
      class="text-4xl md:mx-16"
    >
      <h1>Select kickout ITNs:</h1>
      <div class="grid grid-cols-3 justify-center gap-10 text-4xl ">
        <div *ngFor="let itn of itnList; let i = index">
          <div class="form-check">
            <input
              class="form-check-input float-left mr-2 mt-1 h-4 w-4 cursor-pointer appearance-none rounded-sm border border-gray-300 bg-white bg-contain bg-center bg-no-repeat align-top transition duration-200 checked:border-blue-600 checked:bg-blue-600 focus:outline-none"
              type="checkbox"
              [value]="itn.ITN"
              (change)="onCheckChange($event)"
              [id]="i"
            />
            <label
              class="form-check-label inline-block text-gray-800"
              [for]="i"
            >
              {{ itn.ITN }}
            </label>
          </div>
        </div>
        <div class="col-span-3"></div>
      </div>
      <!-- button area -->
      <div class="grid h-16 grid-cols-3 text-2xl md:mt-10 md:h-32 md:text-4xl">
        <green-button (buttonClick)="skip()" buttonText="Skip"></green-button>
        <red-button
          class=" col-start-3"
          buttonText="Kickout"
          [disabled]="selectITN.invalid"
          (buttonClick)="kickout()"
        >
        </red-button>
      </div>
      <ng-container *ngIf="print.error">
        <message-bar
          [message]="print.error.message"
          [name]="print.error.type"
        ></message-bar>
      </ng-container>
    </form>
    <ng-template #loading>
      <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 8 }"></nz-skeleton>
    </ng-template>
  `,
})
export class ItnKickoutComponent implements OnInit {
  public selectITN: FormGroup;
  public print$: Observable<any>;
  public itnList;
  public formArray: FormArray;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _step: TabService,
    private _log: LogService,
    public _label: LabelService,
    private _kickout: kickoutService
  ) {}

  ngOnInit(): void {
    this.itnList = this._label.ITNList;
    this._step.changeSteps(3);
    this.print$ = of(true);
    this.selectITN = this._fb.group({
      itnList: new FormArray([], [Validators.required]),
    });
    this.formArray = this.selectITN.get('itnList') as FormArray;
  }

  onCheckChange(event) {
    if (event.target.checked) {
      // Add a new control in the arrayForm
      this.formArray.push(new FormControl(event.target.value));
    } else {
      let i = 0;
      this.formArray.controls.forEach((ctrl: FormControl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          this.formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
    this._kickout.updatekickoutItns(this.formArray.value);
  }

  skip(): void {
    this._router.navigate(['receiptreceiving/part'], {
      queryParams: {
        receipt: this._log.receivingLog.ReceiptHeader,
        line: this._log.receivingLog.ReceiptLine,
        name: 'finish',
      },
    });
  }

  public kickout(): void {
    if (!this.formArray.value.length) {
      return;
    }
    this._router.navigate(['receiptreceiving/kickout']);
  }
}
