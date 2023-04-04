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
  template: `
    <form nz-form [formGroup]="filterForm">
      <div nz-row nzAlign="bottom" nzGutter="8" nzJustify="space-between">
        <nz-form-item nz-col nzSpan="4" *ngIf="fetchUser$ | async as userList">
          <nz-form-control>
            <nz-select
              nzAllowClear
              nzPlaceHolder="Select a User"
              formControlName="user"
            >
              <nz-option
                *ngFor="let user of userList"
                [nzLabel]="user.Name"
                [nzValue]="user.Name"
              ></nz-option>
            </nz-select>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item nz-col nzSpan="4">
          <nz-form-control
            nzHasFeedback
            nzErrorTip="The input is not valid barcode!"
          >
            <input
              nz-input
              oninput="this.value = this.value.toUpperCase()"
              formControlName="order"
              placeholder="filter by Order-NOSI"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item nz-col nzSpan="4">
          <nz-form-control
            nzHasFeedback
            nzErrorTip="The input is not valid barcode!"
          >
            <input
              nz-input
              oninput="this.value = this.value.toUpperCase()"
              formControlName="ITN"
              placeholder="filter by ITN"
            />
          </nz-form-control>
        </nz-form-item>

        <nz-form-item nz-col nzSpan="6">
          <nz-form-control>
            <nz-range-picker
              [nzShowTime]="true"
              formControlName="timeRange"
              (ngModelChange)="onChange($event)"
            ></nz-range-picker>
          </nz-form-control>
        </nz-form-item>
      </div>

      <div nz-row nzGutter="8" nzJustify="start">
        <nz-form-control
          nz-col
          nzSpan="16"
          *ngIf="listOfEvent$ | async as list"
        >
          <nz-select
            nzMode="multiple"
            nzPlaceHolder="Select events"
            nzAllowClear
            formControlName="events"
            [nzOptions]="list"
          >
          </nz-select>
          <ng-template #tagPlaceHolder let-selectedList
            >and {{ selectedList.length }} more selected</ng-template
          >
        </nz-form-control>
        <div nz-col nzSpan="6">
          <button nz-button nzType="primary" (click)="onSubmit()" class="mr-4">
            Search
          </button>
          <button nz-button (click)="resetForm()" class="mr-4">Clear</button>
          <button nz-button (click)="exportexcel()">Save</button>
        </div>
      </div>
    </form>
  `,
})
export class SearchFilterComponent {
  @Output() search: EventEmitter<any> = new EventEmitter();
  @Output() excel: EventEmitter<any> = new EventEmitter();

  public onClick(data): void {
    this.click.emit(data);
  }
}
