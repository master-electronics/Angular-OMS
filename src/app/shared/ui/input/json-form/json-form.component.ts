import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  inject,
  Output,
  EventEmitter,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { JsonFormControls, JsonFormData } from './json-form.service';

@Component({
  selector: 'app-json-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="myForm" (ngSubmit)="onSubmit()">
      <div class="mb-4 grid grid-cols-5 gap-4">
        <div *ngFor="let control of jsonFormData?.controls">
          <label
            class="mb-2 block text-sm font-medium text-gray-900"
            *ngIf="control.label !== ''"
            >{{ control.label }}</label
          >
          <input
            class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            *ngIf="
              [
                'text',
                'password',
                'email',
                'number',
                'search',
                'tel',
                'url'
              ].includes(control.type)
            "
            [type]="control.type"
            [formControlName]="control.name"
            [value]="control.value"
          />
          <textarea
            *ngIf="control.type === 'textarea'"
            [formControlName]="control.name"
            [value]="control.value"
          ></textarea>
          <input
            type="checkbox"
            *ngIf="control.type === 'checkbox'"
            [formControlName]="control.name"
            [checked]="control.value"
          />
        </div>
      </div>

      <button
        class="mb-2 mr-2 h-10 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300"
        type="submit"
      >
        Submit
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonFormComponent implements OnChanges {
  @Input() jsonFormData: JsonFormData;
  @Output() formSubmit: EventEmitter<any> = new EventEmitter();
  private _fb = inject(FormBuilder);
  public myForm: FormGroup = this._fb.group({});

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.jsonFormData.firstChange) {
      this.createForm(this.jsonFormData.controls);
    }
  }

  createForm(controls: JsonFormControls[]) {
    this.myForm = this._fb.group({});
    for (const control of controls) {
      const validatorsToAdd = [];
      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }
      this.myForm.addControl(
        control.name,
        this._fb.control(control.value, validatorsToAdd)
      );
    }
  }
  onSubmit() {
    if (this.myForm.valid) {
      this.formSubmit.emit(this.myForm.value);
    }
  }
}
