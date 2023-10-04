import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  inject,
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
      <div
        *ngFor="let control of jsonFormData?.controls"
        class="grid grid-flow-col"
      >
        <div>
          <label *ngIf="control.label !== ''">{{ control.label }}</label>
          <input
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
        <button type="submit">Submit</button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonFormComponent implements OnChanges {
  @Input() jsonFormData: JsonFormData;
  private _fb = inject(FormBuilder);
  public myForm: FormGroup = this._fb.group({});

  ngOnChanges(changes: SimpleChanges): void {
    this.createForm(this.jsonFormData.controls);
  }

  createForm(controls: JsonFormControls[]) {
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
    console.log('Form valid: ', this.myForm.valid);
    console.log('Form values: ', this.myForm.value);
  }
}
