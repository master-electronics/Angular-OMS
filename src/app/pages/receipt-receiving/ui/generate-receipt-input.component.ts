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
  ],
  selector: 'generate-receipt-input',
  template: `
    <form
      [formGroup]="inputForm"
      class="text-lg md:text-xl lg:text-4xl"
      (ngSubmit)="onSubmit()"
    >
      <!-- PurchaseOrder -->
      <div>
        <label for="purchaseOrder" class="block font-medium "
          >purchaseOrder</label
        >
        <input
          autocomplete="off"
          formControlName="purchaseOrder"
          type="text"
          name="purchaseOrder"
          id="purchaseOrder"
          [ngClass]="
            this.inputForm.get('purchaseOrder').invalid &&
            this.inputForm.get('purchaseOrder').dirty
              ? 'border-red-500'
              : 'border-blue-500'
          "
          class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg
        border bg-gray-50 p-2.5 text-gray-900"
          #purchaseOrder
        />
      </div>
      <!-- LineNumber -->
      <div>
        <label for="lineNumber" class="block font-medium">lineNumber</label>
        <input
          autocomplete="off"
          formControlName="lineNumber"
          type="number"
          name="lineNumber"
          id="lineNumber"
          [ngClass]="
            this.inputForm.get('lineNumber').invalid &&
            this.inputForm.get('lineNumber').dirty
              ? 'border-red-500'
              : 'border-blue-500'
          "
          class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border bg-gray-50 p-2.5 text-gray-900 "
          #lineNumber
        />
      </div>
      <!-- Quantity -->
      <div>
        <label for="quantity" class="block font-medium">quantity</label>
        <input
          autocomplete="off"
          formControlName="quantity"
          type="number"
          name="quantity"
          id="quantity"
          [ngClass]="
            this.inputForm.get('lineNumber').invalid &&
            this.inputForm.get('lineNumber').dirty
              ? 'border-red-500'
              : 'border-blue-500'
          "
          class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border bg-gray-50 p-2.5 text-gray-900 "
          #quantity
        />
      </div>
      <!-- error message -->
      <div *ngIf="data?.error; else space" class="h-16">
        <message-bar
          [message]="data?.error.message"
          [name]="data?.error.name"
        ></message-bar>
      </div>
      <ng-template #space>
        <div class=" h-16"></div>
      </ng-template>
      <!-- Button area -->
      <div
        class="grid h-12 w-full grid-cols-3 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
      >
        <submit-button (buttonClick)="onSubmit()" *ngIf="data; else loading">
        </submit-button>
        <ng-template #loading>
          <loader-button></loader-button>
        </ng-template>
        <normal-button
          class="col-start-3"
          (buttonClick)="onBack()"
        ></normal-button>
      </div>
    </form>
  `,
})
export class GenerateReceiptInputComponent implements OnInit {
  public inputForm: FormGroup;

  @Input() data = { error: null };
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();
  @Output() formBack: EventEmitter<null> = new EventEmitter();
  @ViewChild('purchaseOrder') purchaseOrderFiled!: ElementRef;

  ngAfterViewInit(): void {
    this.purchaseOrderFiled?.nativeElement.focus();
  }

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
    this.purchaseOrderFiled.nativeElement.focus();
  }
}
