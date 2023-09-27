import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { JsonFormData } from './json-form.service';

@Component({
  selector: 'app-json-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JsonFormComponent implements OnChanges {
  @Input() jsonFormData: JsonFormData;
  private _fb = inject(FormBuilder);
  public myForm: FormGroup = this._fb.group({});

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.jsonFormData.firstChange) {
      console.log(this.jsonFormData);
    }
  }
}
