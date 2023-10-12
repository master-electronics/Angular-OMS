import { computed, Injectable, signal } from '@angular/core';

interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: boolean;
  maxLength?: boolean;
  pattern?: RegExp;
  nullValidator?: boolean;
}
interface JsonFormControlOptions {
  min?: string;
  max?: string;
  step?: string;
  icon?: string;
}
export interface JsonFormControls {
  name: string;
  label: string;
  value: string;
  type: string;
  options?: JsonFormControlOptions;
  required: boolean;
  validators: JsonFormValidators;
}
export interface JsonFormData {
  controls: JsonFormControls[];
}

@Injectable()
export class JsonFormService {
  private _jsonForm = signal<JsonFormData>(null);
  public jsonForm = computed(() => this._jsonForm());

  setJsonForm(data: JsonFormData) {
    this._jsonForm.set(data);
  }
}
