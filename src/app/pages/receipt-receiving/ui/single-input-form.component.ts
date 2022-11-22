import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { AlertBarComponent } from 'src/app/shared/ui/alert-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSkeletonModule,
    AlertBarComponent,
  ],
  selector: 'single-input-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form
      *ngIf="data; else loading"
      [formGroup]="inputForm"
      (ngSubmit)="onSubmit()"
    >
      <div class="text-2xl">
        <label class="mb-0.5 block font-bold text-gray-700" for="input">
          {{ title }}
        </label>
        <input
          [formControlName]="controlName"
          [ngClass]="
            this.inputForm.get(this.controlName).invalid &&
            this.inputForm.get(this.controlName).dirty
              ? 'border-red-500'
              : 'border-blue-500'
          "
          class="focus:shadow-outline mb-3 h-fit w-full appearance-none rounded border py-2 px-3 text-4xl leading-tight text-gray-700 shadow focus:outline-none"
          id="input"
          [type]="inputType"
          [placeholder]="placeholder"
          #input
        />
        <div
          *ngIf="
            this.inputForm.get(this.controlName).invalid &&
            this.inputForm.get(this.controlName).dirty
          "
          class="text-lg italic text-red-500"
        >
          <div *ngIf="inputForm.get(controlName).errors?.['required']">
            This field is required.
          </div>
          <div *ngIf="inputForm.get(controlName).errors?.[validator.name]">
            {{ validator.message }}
          </div>
        </div>

        <div class="flex w-full flex-row md:mt-16">
          <button
            class="h-32 w-2/5  rounded-lg bg-blue-700 font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            [disabled]="inputForm.invalid"
          >
            Submit
          </button>
          <div class="grow"></div>
          <button
            type="button"
            class="h-32 w-2/5 rounded-lg border border-gray-200 bg-gray-100 font-medium text-gray-900 hover:bg-gray-200 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
            type="button"
            (click)="onBack()"
          >
            Back
          </button>
        </div>
        <div *ngIf="data?.error">
          <alert-bar
            [message]="data?.error.message"
            [name]="data?.error.name"
          ></alert-bar>
        </div>
      </div>
    </form>
    <ng-template #loading>
      <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 4 }"></nz-skeleton>
    </ng-template>
  `,
})
export class SingleInputformComponent implements OnInit {
  public inputForm: FormGroup;
  public input;
  @Input() data = { loading: false, error: null };
  @Input() validator = { name: '', message: '' };
  @Input() controlName = 'input';
  @Input() inputType = 'text';
  @Input() placeholder = '';
  @Input() title = 'Input';
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();
  @Output() formBack: EventEmitter<null> = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  @ViewChild('input') inputFiled!: ElementRef;
  ngAfterViewInit(): void {
    this.inputFiled.nativeElement.focus();
  }

  public ngOnInit(): void {
    this.inputForm = this.controlContainer.control as FormGroup;
    this.input = this.inputForm.get(this.controlName);
  }

  public onSubmit(): void {
    this.inputFiled.nativeElement.select();
    this.formSubmit.emit();
  }

  public onBack(): void {
    this.formBack.emit();
  }

  public checkValidate(): boolean {
    return (
      this.inputForm.get(this.controlName).invalid &&
      (this.inputForm.get(this.controlName).dirty ||
        this.inputForm.get(this.controlName).touched)
    );
  }
}
