import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChildren,
  inject,
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
import { map, Observable, startWith, switchMap, tap } from 'rxjs';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';
import { AssignLabelInfo, LabelService } from '../../data/label';
import { ReceiptInfoService } from '../../data/ReceiptInfo';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { EditInfoComponent } from './edit-info.component';
import { InsertReceiptLineDetailsDocument } from 'src/app/graphql/receiving.graphql-gen';
import { toObservable } from '@angular/core/rxjs-interop';

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
    <div class="grid grid-cols-3 gap-5 text-xl">
      <h1>Total: {{ label.total }}</h1>
      <h1>Remaining: {{ label.remaining() }}</h1>
      <h1>Open for POs: {{ openForPOs }}</h1>
    </div>

    <form [formGroup]="inputForm">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div *ngFor="let control of listOfControl; let i = index">
          <div class="relative">
            <div class="grid grid-cols-4 gap-2">
              <input
                type="number"
                placeholder="Quantity"
                [attr.id]="control.controlInstance.itn"
                [formControlName]="control.controlInstance.itn"
                (ngModelChange)="this.label.updateItnListQty($event, i)"
                class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
                #itn
              />
              <div class="grid grid-rows-2 text-lg">
                <h1>DateCode:{{ label.ITNList[i].datecode }}</h1>
                <h1>Country:{{ label.ITNList[i].ISO3 }}</h1>
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
                class="bottom-2.5 right-2.5 rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800"
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
        [datecode]="this.label.ITNList[editingIndex].datecode"
        [ISO3]="this.label.ITNList[editingIndex].ISO3"
      ></edit-info>
    </ng-container>

    <ng-container *ngIf="authWindow">
      <auth-modal
        [message]="message"
        (clickClose)="authWindow = false"
        (passAuth)="nextPage()"
      ></auth-modal>
    </ng-container>
  `,
})
export class AssignLabelComponent implements OnInit {
  validator$: Observable<boolean>;
  openForPOs = 0;
  editingIndex = 0;
  authWindow = false;
  message = '';
  editWindow = false;
  inputForm: FormGroup;
  listOfControl: Array<{
    id: number;
    controlInstance: { itn: string };
  }> = [];

  receipt = inject(ReceiptInfoService);
  label = inject(LabelService);
  constructor(
    public updateInfo: updateReceiptInfoService,
    private _fb: FormBuilder,
    private _router: Router,
    private _step: TabService
  ) {
    this.inputForm = this._fb.group({});
    this.initList();
    this.validator$ = this.inputForm.valueChanges.pipe(
      map((res) => {
        let sum = 0;
        Object.values(res).forEach((element, index) => {
          sum += Number(element);
        });
        return this.label.total - sum;
      }),
      map((res) => {
        return res !== 0 || this.inputForm.invalid;
      })
    );
  }

  ngOnInit(): void {
    this._step.changeSteps(3);
    const purchaseOrder =
      this.receipt.selectedReceiptLine[0].RECEIPTLDs[0].PurchaseOrderL;
    this.openForPOs =
      purchaseOrder.QuantityOnOrder - purchaseOrder.QuantityReceived;
  }

  @ViewChildren('itn') inputFiledList: QueryList<ElementRef>;

  public splitInteger(total: number, count: number): number[] {
    const result: number[] = [];
    return result;
  }

  initList(): void {
    this.label.initItnList();
    this.label.ITNList.map((itn, index) => {
      // add a control for inpuForm
      this.inputForm.addControl(
        `itn${index}`,
        new FormControl(itn.quantity, [Validators.required, Validators.min(1)])
      );
      // store information inot listOfControl
      this.listOfControl.push({
        id: index,
        controlInstance: {
          itn: `itn${index}`,
        },
      });
    });
  }

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
        itn: `itn${id}`,
      },
    };
    this.label.insertNewItn();
    const index = this.listOfControl.push(control);
    this.inputForm.addControl(
      this.listOfControl[index - 1].controlInstance.itn,
      new FormControl(0, [Validators.required, Validators.min(1)])
    );
    setTimeout(() => {
      this.inputFiledList
        .get(this.listOfControl.length - 1)
        .nativeElement.select();
    }, 0);
  }

  removeField(
    i: {
      id: number;
      controlInstance: { itn: string };
    },
    e: MouseEvent
  ): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.label.removeItn(index);
      this.inputForm.removeControl(i.controlInstance.itn);
    }
  }

  onSubmit(): void {
    if (this.inputForm.valid) {
      const quantityList = [];
      Object.values(this.inputForm.value).forEach((ele, index) => {
        quantityList.push(Number(ele));
      });
      if (
        this.label.ITNList.some((info) => info.datecode === '') &&
        this.updateInfo.receiptInfo.DateCode !== ''
      ) {
        this.authWindow = true;
        this.message = 'Allow empty DateCode!';
        return;
      }
      if (
        this.label.ITNList.some((info) => info.ISO3 === 'UNK') &&
        this.updateInfo.receiptInfo.ISO3 !== 'UNK'
      ) {
        this.authWindow = true;
        this.message = 'Allow unknown country code!';
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

  editInfo(info: AssignLabelInfo) {
    this.label.updateItnlistInfo(info, this.editingIndex);
    this.editWindow = false;
  }

  public nextPage(): void {
    this._router.navigateByUrl('receiptreceiving/label/printitn');
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/update/itncount');
  }
}
