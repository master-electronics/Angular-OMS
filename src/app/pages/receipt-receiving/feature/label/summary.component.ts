import { CommonModule, LocationStrategy } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { AuthModalComponent } from 'src/app/shared/ui/modal/auth-modal.component';
import { LabelService } from '../../data/label';
import { updateReceiptInfoService } from '../../data/updateReceipt';
import { TabService } from '../../../../shared/ui/step-bar/tab';
import { EditInfoComponent } from './edit-info.component';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { PrinterService } from 'src/app/shared/data/printer';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';
import { LoaderButtonComponent } from 'src/app/shared/ui/button/loader-button.component';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    SubmitButtonComponent,
    GreenButtonComponent,
    NormalButtonComponent,
    LoaderButtonComponent,
    AuthModalComponent,
    EditInfoComponent,
    MessageBarComponent,
    NzSkeletonModule,
  ],

  template: `
    <div class="grid grid-cols-3 gap-5 text-xl">
      <h1>Total: {{ label.total }}</h1>
      <h1>Remaining: {{ label.remaining() }}</h1>
      <h1>Open for POs: {{ label.openQuantityForPOs }}</h1>
    </div>

    <form [formGroup]="inputForm">
      <div *ngIf="data$ | async as data">
        <!-- ITN info list -->
        <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div *ngFor="let control of listOfControl; let i = index">
            <div class="relative">
              <div class="grid grid-cols-4 gap-2">
                <div class="col-span-2 grid grid-rows-2">
                  <div class="grid grid-cols-2">
                    <h1>ITN:{{ label.ITNList[i].ITN }}</h1>
                    <h1>Location:{{ label.ITNList[i].BinLocation }}</h1>
                  </div>
                  <div class="grid grid-cols-3">
                    <h1>Qty:{{ label.ITNList[i].quantity }}</h1>
                    <h1>DateCode:{{ label.ITNList[i].datecode }}</h1>
                    <h1>Country:{{ label.ITNList[i].ISO3 }}</h1>
                  </div>
                </div>

                <button
                  (click)="printItn(label.ITNList[i].ITN)"
                  class="rounded-lg bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800"
                >
                  Print
                </button>
                <button
                  *ngIf="authWindow"
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
        <div
          class="mt-8 grid h-16 w-full grid-cols-4 gap-6 md:h-32 md:text-4xl"
        >
          <submit-button
            *ngIf="data; else buttonLoading"
            [disabled]="validator$ | async"
            [loading]="!data"
            buttonText="Submit"
            (buttonClick)="onSubmit()"
          >
          </submit-button>
          <div></div>
          <green-button buttonText="Edit" (buttonClick)="authWindow = true">
          </green-button>
          <normal-button (buttonClick)="onBack()"></normal-button>
        </div>
        <!-- message bar -->
        <div *ngIf="data?.error" class="mt-4 h-16">
          <message-bar
            [message]="data?.error.message"
            [name]="data?.error.name"
          ></message-bar>
        </div>
      </div>
      <ng-template #buttonLoading>
        <nz-skeleton
          [nzActive]="true"
          [nzParagraph]="{ rows: 5 }"
        ></nz-skeleton>
      </ng-template>
    </form>

    <ng-container *ngIf="authWindow">
      <auth-modal
        message="Remove ITN(s)!"
        (clickClose)="authWindow = false"
        (passAuth)="authWindow = true"
      ></auth-modal>
    </ng-container>
  `,
})
export class SummaryComponent implements OnInit {
  validator$: Observable<boolean>;
  data$: Observable<any>;
  authWindow = false;
  inputForm: FormGroup;
  listOfControl: Array<{
    id: number;
    controlInstance: { itn: string };
  }> = [];

  print = inject(PrinterService);
  label = inject(LabelService);
  constructor(
    public updateInfo: updateReceiptInfoService,
    private _fb: FormBuilder,
    private _router: Router,
    private _step: TabService,
    private location: LocationStrategy
  ) {
    this.inputForm = this._fb.group({});
    this.initList();
    this.validator$ = this.inputForm.valueChanges.pipe(
      map((res) => {
        let sum = 0;
        Object.values(res).forEach((element) => {
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
    this.data$ = of(true);

    // preventing back button
    history.pushState(null, null, window.location.href);
    this.location.onPopState(() => {
      history.pushState(null, null, window.location.href);
    });
  }

  public splitInteger(total: number, count: number): number[] {
    const result: number[] = [];
    return result;
  }

  initList(): void {
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
    this.data$ = this.label.updateAfterReceving().pipe(
      map(() => {
        this._router.navigateByUrl('receiptreceiving/itnkickout');
      }),
      catchError((error) => {
        return of({
          error: { message: error.message, type: 'error' },
        });
      }),
      shareReplay(1)
    );
  }

  printItn(itn: string) {
    this.data$ = this.print
      .printITN$(
        itn,
        this.label.receiptProductCode,
        this.label.receiptPartNumber
      )
      .pipe(map(() => true));
  }

  public onBack(): void {
    this._router.navigateByUrl('receiptreceiving/label/assign');
  }
}
