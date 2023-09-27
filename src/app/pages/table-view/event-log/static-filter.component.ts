import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
  ],
  selector: 'search-filter',
  template: ` <form nz-form [formGroup]="filterForm"></form> `,
})
export class SearchFilterComponent {
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() excel: EventEmitter<any> = new EventEmitter();

  public onClick(data): void {
    this.click.emit(data);
  }
}
