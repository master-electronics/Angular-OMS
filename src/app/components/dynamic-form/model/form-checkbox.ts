import { FormInputBase } from './form-input-base';

export class FormCheckbox extends FormInputBase<string> {
  override controlType = 'checkbox';
}
