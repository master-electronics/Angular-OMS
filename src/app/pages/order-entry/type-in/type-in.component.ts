import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'type-in',
  templateUrl: './type-in.component.html',
})
export class TypeInComponent implements OnInit {
  customerNumberError = 'test';
  branchs = [
    { value: 'SM', view: 'SM-Santa Monica' },
    { value: 'OK', view: 'OK-Oakland' },
    { value: 'FM', view: 'FM-Miami' },
    { value: 'WA', view: 'WA-Washington' },
    { value: 'DS', view: 'DS-Drop Ship' },
    { value: 'IL', view: 'IL-Master Rockford' },
    { value: 'PH', view: 'PH-Phoenix' },
    { value: 'IW', view: 'IW-Illinois' },
    { value: 'PS', view: 'PS-Phoenix Special' },
    { value: 'WI', view: 'WI-Milwaukee' },
    { value: 'FA', view: 'FA-All American' },
    { value: 'MC', view: 'MC-Master Electronic' },
    { value: 'IN', view: 'IN-Rohs NonCompliant' },
    { value: 'MN', view: 'MN-Minnesota' },
    { value: 'UL', view: 'UL-Miami Sales' },
  ];

  ngOnInit(): void {
    //
  }
}
