import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { map, Observable, startWith, tap } from 'rxjs';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';
import { SimpleKeyboardComponent } from 'src/app/shared/ui/simple-keyboard.component';
import { DefalutDateCode } from 'src/app/shared/utils/dataRegex';
import { LabelService } from '../../data/label';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { TabService } from '../../data/tab';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SimpleKeyboardComponent,
    ReactiveFormsModule,
    NzIconModule,
    GreenButtonComponent,
    SubmitButtonComponent,
    NormalButtonComponent,
    AuthModalComponent,
  ],

  template: `
    <div class="grid grid-cols-2 gap-5 text-xl">
      <h1>Total: {{ total }}</h1>
      <h1>Remaining: {{ remaining }}</h1>
    </div>

    <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <div
        class="grid h-16 grid-cols-1 gap-5 overflow-auto md:h-32 lg:h-64 lg:grid-cols-2"
      >
        <div *ngFor="let control of listOfControl; let i = index">
          <div class="relative">
            <div class="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Quantity"
                [attr.id]="control.controlInstance.quantity"
                (focus)="onInputFocus($event)"
                [formControlName]="control.controlInstance.quantity"
                class="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
                #quantity
              />
              <div class="flex items-center">
                <label
                  class="text-lg font-bold text-gray-700"
                  [for]="control.controlInstance.datecode"
                >
                  DateCode:
                </label>
                <input
                  type="text"
                  (focus)="onInputFocus($event)"
                  [attr.id]="control.controlInstance.datecode"
                  [formControlName]="control.controlInstance.datecode"
                  class="w-full rounded-lg border border-gray-300 bg-gray-50 p-4 pl-10 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  #datecode
                />
              </div>
            </div>
            <div
              *ngIf="
                inputForm.get(control.controlInstance.datecode).invalid &&
                inputForm.get(control.controlInstance.datecode).dirty
              "
              class="text-lg italic text-red-500"
            >
              <div
                *ngIf="inputForm.get(control.controlInstance.datecode).errors?.['datecode']"
              >
                Invalid DateCode Format!
              </div>
            </div>
            <button
              type="remove"
              (click)="removeField(control, $event)"
              class="absolute right-2.5 bottom-2.5 rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <!-- button area -->
      <div class="mt-4 grid h-16 w-full grid-cols-4 gap-6 md:h-32 md:text-4xl">
        <green-button
          (buttonClick)="addField($event)"
          buttonText="Add Label"
        ></green-button>
        <div></div>
        <submit-button [disabled]="validator$ | async" buttonText="Verify">
        </submit-button>
        <normal-button (buttonClick)="onBack()"></normal-button>
      </div>
    </form>
    <simple-keyboard
      layout="number"
      [inputString]="this.currentInputFied?.value"
      (outputString)="onChange($event)"
    ></simple-keyboard>

    <ng-container *ngIf="popup">
      <auth-modal
        message="Allow Empty DateCode!"
        (clickClose)="this.popup = false"
        (passAuth)="nextPage()"
      ></auth-modal>
    </ng-container>
  `,
})
export class AssignLabelComponent implements OnInit {
  public validator$: Observable<boolean>;
  public currentInputFied;
  public total = 0;
  public remaining = 0;
  public popup = false;
  public inputForm: FormGroup;
  public listOfControl: Array<{
    id: number;
    controlInstance: { quantity: string; datecode: string };
  }> = [];

  constructor(
    public receipt: ReceiptInfoService,
    private _updateInfo: updateReceiptInfoService,
    private _fb: FormBuilder,
    private _router: Router,
    private _step: TabService,
    private _label: LabelService
  ) {}

  ngOnInit(): void {
    this.total = this.receipt.selectedReceiptLine[0].ExpectedQuantity;
    this._label.reset();
    this.remaining = this.total;
    this._step.changeSteps(3);
    this.inputForm = this._fb.group({});
    this.addField();
    this.validator$ = this.inputForm.valueChanges.pipe(
      startWith(true),
      map((res) => {
        let sum = 0;
        Object.values(res).forEach((element, index) => {
          if (index % 2 === 0) {
            sum += Number(element);
          }
        });
        this.remaining = this.total - sum;
        return this.remaining;
      }),
      map((res) => {
        return res !== 0 || this.inputForm.invalid;
      })
    );
  }

  @ViewChildren('quantity') inputFiledList: QueryList<ElementRef>;

  addField(e?: MouseEvent): void {
    if (e) {
      e.preventDefault();
    }
    const id =
      this.listOfControl.length > 0
        ? this.listOfControl[this.listOfControl.length - 1].id + 1
        : 0;

    const control = {
      id,
      controlInstance: { quantity: `quantity${id}`, datecode: `datecode${id}` },
    };
    const index = this.listOfControl.push(control);
    this.inputForm.addControl(
      this.listOfControl[index - 1].controlInstance.quantity,
      new FormControl(0, [Validators.required, Validators.min(1)])
    );
    this.inputForm.addControl(
      this.listOfControl[index - 1].controlInstance.datecode,
      new FormControl(this._updateInfo.receiptInfo.DateCode, [
        this.checkDateCode(),
      ])
    );
    setTimeout(() => {
      if (!id) {
        this.inputForm.get(`quantity${id}`).setValue(this.total);
      }
      this.inputFiledList
        .get(this.listOfControl.length - 1)
        .nativeElement.select();
    }, 0);
  }

  public checkDateCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const isVaild = DefalutDateCode.test(value);
      return !isVaild ? { datecode: true } : null;
    };
  }

  removeField(
    i: { id: number; controlInstance: { quantity: string; datecode: string } },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.inputForm.removeControl(i.controlInstance.quantity);
      this.inputForm.removeControl(i.controlInstance.datecode);
    }
  }

  onInputFocus(event) {
    this.currentInputFied = this.inputForm.get(event.target.id);
  }

  onChange(input) {
    this.currentInputFied.setValue(input);
  }

  private quantityList = [];
  private datecodeList = [];
  onSubmit(): void {
    if (this.inputForm.valid) {
      this.quantityList = [];
      this.datecodeList = [];
      Object.values(this.inputForm.value).forEach((ele, index) => {
        if (index % 2 === 0) {
          this.quantityList.push(Number(ele));
          return;
        }
        this.datecodeList.push(ele);
      });
      if (
        this.datecodeList.some((ele) => ele === '') &&
        this._updateInfo.receiptInfo.DateCode !== ''
      ) {
        this.popup = true;
        return;
      }
      this.nextPage();
    } else {
      Object.values(this.inputForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  public nextPage(): void {
    this._label.changeQuantityList(this.quantityList);
    this._label.changeDatecodeList(this.datecodeList);
    this._router.navigateByUrl('receiptreceiving/label/printitn');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/ROHS');
  }
}
