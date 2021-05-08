import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'select-lists',
  templateUrl: './select-lists.component.html',
})
export class SelectListsComponent {
  orderTypeList = [
    { value: 'B', view: 'Bond' },
    { value: 'D', view: 'Drop Ship' },
    { value: 'O', view: 'Or Sooner' },
    { value: 'S', view: 'Scheduled' },
    { value: 'U', view: 'Unscheduled' },
  ];
  yesno = [
    { value: 'N', view: 'NO' },
    { value: 'Y', view: 'YES' },
  ];
  TERMSList = [
    { value: '03', view: '03-CIA' },
    { value: '08', view: '08-Credit Pending' },
    { value: '43', view: '43-Inactive' },
    { value: '44', view: '44-Counter COD' },
    { value: '48', view: '48-Wire Transfer' },
  ];
  partCompList = [
    { value: 'p', view: 'Partial' },
    { value: 'c', view: 'Complete' },
    { value: 'l', view: 'Line Complete' },
  ];
  orderType = new FormControl();
  public listGroup: FormGroup;
  constructor(private fb: FormBuilder) {
    this.listGroup = this.fb.group({
      orderType: [{ value: 'U', view: 'Unscheduled' }, Validators.required],
    });
  }
}
