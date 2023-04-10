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
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import { EventLogService } from 'src/app/shared/data/eventLog';
import { CommonService } from 'src/app/shared/services/common.service';
import { SingleInputformComponent } from 'src/app/shared/ui/input/single-input-form.component';
import { ITNBarcodeRegex } from 'src/app/shared/utils/dataRegex';
import { ItnSeperateService } from '../data/itn-seperate.service';
import { GreenButtonComponent } from 'src/app/shared/ui/button/green-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SingleInputformComponent,
    ReactiveFormsModule,
    GreenButtonComponent,
    NormalButtonComponent,
    SubmitButtonComponent,
  ],
  template: `
    <div class="grid grid-cols-2 gap-5 text-xl">
      <h1>Total: {{ this.itn.itnInfo.Quantity }}</h1>
      <h1>Remaining: {{ remaining }}</h1>
    </div>
    <!-- assign ITN Quantity  -->
    <form [formGroup]="inputForm">
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div *ngFor="let control of listOfControl; let i = index">
          <div class="relative">
            <div class="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Quantity"
                [attr.id]="control.controlInstance.quantity"
                [formControlName]="control.controlInstance.quantity"
                class="col-span-2 w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
                #quantity
              />
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
      <div class="mt-8 grid h-32 w-full grid-cols-2 gap-6 md:h-32 md:text-4xl">
        <green-button
          (buttonClick)="addField($event)"
          buttonText="Add Label"
        ></green-button>
        <div></div>
        <submit-button
          [disabled]="validator$ | async"
          buttonText="Seperate"
          (buttonClick)="onSubmit()"
        >
        </submit-button>
        <normal-button (buttonClick)="onBack()"></normal-button>
      </div>
    </form>
  `,
})
export class AssignComponent implements OnInit {
  public remaining = 0;
  public validator$: Observable<boolean>;
  public inputForm: FormGroup;
  public listOfControl: Array<{
    id: number;
    controlInstance: { quantity: string };
  }> = [];

  constructor(
    public itn: ItnSeperateService,
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _itn: ItnSeperateService
  ) {}

  @ViewChildren('quantity') inputFiledList: QueryList<ElementRef>;
  ngOnInit(): void {
    this.remaining = this._itn.itnInfo.Quantity;
    this.inputForm = this._fb.group({});
    this.addField();
    this.validator$ = this.inputForm.valueChanges.pipe(
      startWith(true),
      map((res) => {
        let sum = 0;
        Object.values(res).forEach((element, index) => {
          sum += Number(element);
        });
        this.remaining = this._itn.itnInfo.Quantity - sum;
        return this.remaining;
      }),
      map((res) => {
        return res !== 0 || this.inputForm.invalid;
      })
    );
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
        quantity: `quantity${id}`,
      },
    };
    const index = this.listOfControl.push(control);
    this.inputForm.addControl(
      this.listOfControl[index - 1].controlInstance.quantity,
      new FormControl(0, [Validators.required, Validators.min(1)])
    );
    setTimeout(() => {
      if (!id) {
        this.inputForm
          .get(`quantity${id}`)
          .setValue(this._itn.itnInfo.Quantity);
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

  onSubmit(): void {
    if (this.inputForm.valid) {
      const quantityList: number[] = [];
      Object.values(this.inputForm.value).forEach((ele, index) => {
        quantityList.push(Number(ele));
      });
      this._itn.seperateITN(quantityList);
      this._router.navigate(['../scan'], {
        relativeTo: this._actRoute,
        queryParams: {
          ITN: this._itn.itnInfo,
        },
      });
    } else {
      Object.values(this.inputForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  onBack(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
