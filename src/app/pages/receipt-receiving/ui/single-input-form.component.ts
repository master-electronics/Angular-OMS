import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
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
  template: `
    <form
      *ngIf="data; else loading"
      [formGroup]="inputForm"
      (ngSubmit)="onSubmit()"
    >
      <div class="mb-16 text-2xl">
        <label class="mb-2 block font-bold text-gray-700" for="input">
          {{ title }}
        </label>
        <input
          [formControlName]="controlName"
          [ngClass]="checkValidate() ? 'border-red-500' : 'border-blue-500'"
          class="focus:shadow-outline mb-3 h-fit w-full appearance-none rounded border py-2 px-3 text-3xl leading-tight text-gray-700 shadow focus:outline-none"
          id="input"
          [type]="inputType"
          [placeholder]="placeholder"
          #input
        />
        <div *ngIf="checkValidate()" class="text-xs italic text-red-500">
          <div *ngIf="inputForm.get(controlName).errors?.['required']">
            This field is required.
          </div>
          <div *ngIf="inputForm.get(controlName).errors?.[validator.name]">
            {{ validator.message }}
          </div>
        </div>
      </div>

      <div class="flex flex-row gap-10">
        <button
          type="submit"
          [disabled]="inputForm.invalid"
          class="h-32 basis-1/2 bg-blue-400 text-2xl"
        >
          Submit
        </button>
        <button
          class="h-32 basis-1/2 bg-gray-300 text-2xl"
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
    </form>
    <ng-template #loading>
      <nz-skeleton [nzActive]="true" [nzParagraph]="{ rows: 4 }"></nz-skeleton>
    </ng-template>
  `,
})
export class SingleInputformComponent implements OnInit {
  public inputForm: FormGroup;
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
