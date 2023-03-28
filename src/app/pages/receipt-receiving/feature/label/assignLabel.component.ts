import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { map, Observable, startWith, tap } from 'rxjs';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';
import { AssignLabelInfo, LabelService } from '../../data/label';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { EditInfoComponent } from './edit-info.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    GreenButtonComponent,
    SubmitButtonComponent,
    NormalButtonComponent,
    AuthModalComponent,
    EditInfoComponent,
  ],

  template: `
    <div class="grid grid-cols-2 gap-5 text-xl">
      <h1>Total: {{ total }}</h1>
      <h1>Remaining: {{ remaining }}</h1>
    </div>

    <form [formGroup]="inputForm">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div *ngFor="let control of listOfControl; let i = index">
          <div class="relative">
            <div class="grid grid-cols-4 gap-2">
              <input
                type="number"
                placeholder="Quantity"
                [attr.id]="control.controlInstance.quantity"
                [formControlName]="control.controlInstance.quantity"
                class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
                #quantity
              />
              <div class="grid grid-rows-2 text-lg">
                <h1>DateCode:{{ listOfInfo[i].datecode }}</h1>
                <h1>Country:{{ listOfInfo[i].country.ISO3 }}</h1>
              </div>

              <button
                type="remove"
                (click)="this.editWindow = true; this.editingIndex = i"
                class="rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
              >
                Edit
              </button>
              <button
                type="remove"
                (click)="removeField(control, $event)"
                class="right-2.5 bottom-2.5 rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- button area -->
      <div class="mt-8 grid h-16 w-full grid-cols-4 gap-6 md:h-32 md:text-4xl">
        <green-button
          (buttonClick)="addField($event)"
          buttonText="Add Label"
        ></green-button>
        <div></div>
        <submit-button
          [disabled]="validator$ | async"
          buttonText="Verify"
          (buttonClick)="onSubmit()"
        >
        </submit-button>
        <normal-button (buttonClick)="onBack()"></normal-button>
      </div>
    </form>

    <ng-container *ngIf="editWindow">
      <edit-info
        (clickCancel)="editWindow = false"
        (clickSubmit)="editInfo($event)"
        [datecode]="this.listOfInfo[editingIndex].datecode"
        [ISO3]="this.listOfInfo[editingIndex].country.ISO3"
      ></edit-info>
    </ng-container>

    <ng-container *ngIf="authWindow">
      <auth-modal
        message="Allow Empty DateCode!"
        (clickClose)="authWindow = false"
        (passAuth)="nextPage()"
      ></auth-modal>
    </ng-container>
  `,
})
export class AssignLabelComponent implements OnInit {
  public validator$: Observable<boolean>;
  public total = 0;
  public remaining = 0;
  public editingIndex = 0;
  public authWindow = false;
  public editWindow = false;
  public inputForm: FormGroup;
  public listOfControl: Array<{
    id: number;
    controlInstance: { quantity: string };
  }> = [];
  public listOfInfo: Array<AssignLabelInfo> = [];

  constructor(
    public receipt: ReceiptInfoService,
    public updateInfo: updateReceiptInfoService,
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
          sum += Number(element);
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
      controlInstance: {
        quantity: `quantity${id}`,
      },
    };
    this.listOfInfo.push({
      datecode: this.updateInfo.receiptInfo.DateCode,
      country: {
        ISO3: this.updateInfo.receiptInfo.ISO3,
        countryID: this.updateInfo.receiptInfo.CountryID,
      },
    });
    const index = this.listOfControl.push(control);
    this.inputForm.addControl(
      this.listOfControl[index - 1].controlInstance.quantity,
      new FormControl(0, [Validators.required, Validators.min(1)])
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

  removeField(
    i: {
      id: number;
      controlInstance: { quantity: string };
    },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.inputForm.removeControl(i.controlInstance.quantity);
    }
  }

  private quantityList = [];
  onSubmit(): void {
    if (this.inputForm.valid) {
      this.quantityList = [];
      Object.values(this.inputForm.value).forEach((ele, index) => {
        this.quantityList.push(Number(ele));
      });
      if (
        (this.listOfInfo.some((info) => info.datecode === '') &&
          this.updateInfo.receiptInfo.DateCode !== '') ||
        (this.listOfInfo.some((info) => info.country.ISO3 === 'UNK') &&
          this.updateInfo.receiptInfo.ISO3 !== 'UNK')
      ) {
        this.authWindow = true;
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

  editInfo(info: AssignLabelInfo): void {
    this.listOfInfo[this.editingIndex] = info;
    this.editWindow = false;
  }

  public nextPage(): void {
    this._label.changeQuantityList(this.quantityList);
    this._label.changeassignLabelInfo(this.listOfInfo);
    this._router.navigateByUrl('receiptreceiving/label/printitn');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/ROHS');
  }
}
