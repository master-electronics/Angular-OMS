import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { catchError, map, of } from 'rxjs';
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
      <h1>Total: {{ this.itn.itnQuantity }}</h1>
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
                class="w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-2xl text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
      <div class="mt-8 grid h-16 w-full grid-cols-4 gap-6 md:h-32 md:text-4xl">
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

  constructor(
    public itn: ItnSeperateService,
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _eventLog: EventLogService
  ) {}

  public data$;
  public inputForm = this._fb.nonNullable.group({
    itn: ['', [Validators.required, Validators.pattern(ITNBarcodeRegex)]],
  });

  ngOnInit(): void {
    this.data$ = of(true);
  }

  onSubmit(): void {
    //
  }

  onBack(): void {
    this._router.navigate(['../'], { relativeTo: this._actRoute });
  }
}
