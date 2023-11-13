import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { LoaderButtonComponent } from 'src/app/shared/ui/button/loader-button.component';
import { NormalButtonComponent } from 'src/app/shared/ui/button/normal-button.component';
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { MessageBarComponent } from 'src/app/shared/ui/message-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzIconModule,
    MessageBarComponent,
    SubmitButtonComponent,
    NormalButtonComponent,
    LoaderButtonComponent,
    NzRadioModule,
  ],
  selector: 'kickout-input-form',
  template: `
    <form
      [formGroup]="inputForm"
      (ngSubmit)="onSubmit()"
      class="text-4xl md:mx-16"
    >
      <nz-radio-group
        id="kickoutReason"
        nzSize="large"
        formControlName="kickoutReason"
        name="kickoutReason"
        #kickoutReason
      >
        <div class="mb-4 grid grid-cols-3 justify-center gap-5">
          <div *ngFor="let option of kickoutOptions">
            <label nz-radio-button [nzValue]="option.value">{{
              option.content
            }}</label>
          </div>
          <!-- <label nz-radio-button nzValue="Other"> Other... </label> -->
        </div>
      </nz-radio-group>
      <textarea
        *ngIf="inputForm.value.kickoutReason === 14"
        id="otherReason"
        name="otherReason"
        formControlName="otherReason"
        #otherReason
        rows="3"
        name="message"
        id="message"
        class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-4 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      ></textarea>
      <div *ngIf="isShowInput">
        <!-- PurchaseOrder -->
        <div>
          <label for="purchaseOrder" class="block font-medium "
            >Purchase Order</label
          >
          <input
            autocomplete="off"
            formControlName="purchaseOrder"
            type="text"
            name="purchaseOrder"
            id="purchaseOrder"
            class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg
        border bg-gray-50 p-2.5 text-gray-900"
          />
        </div>
        <!-- PartNumber -->
        <div>
          <label for="partNumber" class="block font-medium">Part Number</label>
          <input
            autocomplete="off"
            formControlName="partNumber"
            type="text"
            name="partNumber"
            id="partNumber"
            class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border bg-gray-50 p-2.5 text-gray-900 "
          />
        </div>
      </div>
      <div class="grid h-16 grid-cols-3 text-2xl md:mt-10 md:h-32 md:text-4xl">
        <submit-button
          [disabled]="inputForm.invalid"
          (buttonClick)="onSubmit()"
        >
        </submit-button>
        <div></div>
        <normal-button (buttonClick)="onBack()"></normal-button>
      </div>
      <ng-container *ngIf="data.error">
        <message-bar
          [message]="data.error.message"
          [name]="data.error.type"
        ></message-bar>
      </ng-container>
    </form>
  `,
})
export class KickoutinputComponent implements OnInit {
  public inputForm: FormGroup;

  @Input() data = { error: null };
  @Input() isShowInput: boolean;
  @Input() kickoutOptions: { content: string; value: number }[] = [];
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();
  @Output() formBack: EventEmitter<null> = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit() {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  onSubmit() {
    if (this.inputForm.valid) {
      this.formSubmit.emit();
      this.clean();
    }
  }

  onBack() {
    this.formBack.emit();
  }

  clean() {
    this.inputForm.reset();
  }
}
