import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { NzFormTooltipIcon } from 'ng-zorro-antd/form';

@Component({
  selector: 'single-input',
  templateUrl: './single-input.component.html',
})
export class SingleInputComponent {
  public inputForm: FormGroup;
  @Input() parentForm: FormGroup;
  @Input() title: string | 'input';
  @Input() type: string | 'text';
  @Input() placeholder: string | '';

  constructor(private _controlContainer: ControlContainer) {}

  ngOninit(): void {
    this.inputForm = this._controlContainer.control as FormGroup;
  }
}
