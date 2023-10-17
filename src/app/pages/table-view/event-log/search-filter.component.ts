import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzDatePickerModule,
  ],
  selector: 'search-filter',
  template: `
    <form nz-form [formGroup]="filterForm">
      <div class="grid grid-cols-10 gap-3">
        <!-- Event selector -->
        <nz-form-item class="col-span-3 ">
          <nz-form-control *ngIf="listOfEvent as list">
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
        </nz-form-item>
        <!-- User selector -->
        <nz-form-item class="col-span-1" *ngIf="userList">
          <nz-form-control>
            <nz-select
              nzAllowClear
              [nzDropdownRender]="renderTemplate"
              nzShowSearch
              nzPlaceHolder="Select a User"
              formControlName="user"
            >
              <nz-option
                *ngFor="let user of userList"
                [nzLabel]="user.Name"
                [nzValue]="user.Name"
              ></nz-option>
            </nz-select>
            <ng-template #renderTemplate>
              <div class="container">
                <input type="text" nz-input #inputElement />
                <a class="add-item" (click)="addUser.emit(inputElement.value)">
                  Add User
                </a>
              </div>
            </ng-template>
          </nz-form-control>
        </nz-form-item>
        <!-- time selector -->
        <nz-form-item class="col-span-2">
          <nz-form-control>
            <nz-range-picker formControlName="timeRange"></nz-range-picker>
          </nz-form-control>
        </nz-form-item>

        <!-- Event selector -->
        <nz-form-item class="col-span-3 ">
          <nz-form-control *ngIf="listOfFilter as list">
            <nz-select
              nzMode="multiple"
              nzPlaceHolder="Select Filters"
              nzAllowClear
              formControlName="filter"
              [nzOptions]="list"
            >
            </nz-select>
            <ng-template #tagPlaceHolder let-selectedList
              >and {{ selectedList.length }} more selected</ng-template
            >
          </nz-form-control>
        </nz-form-item>

        <!-- Button Area -->
        <nz-form-item class="col-span-1">
          <button
            class="mb-2 mr-2 h-10 rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200"
            (click)="excel.emit()"
          >
            Save
          </button>
        </nz-form-item>
      </div>
    </form>
  `,
})
export class SearchFilterComponent implements OnInit {
  @Input() listOfEvent: { label: string; value: number; groupLabel: string }[];
  @Input() userList: { _id: number; Name: string }[];
  @Input() listOfFilter: { label: string; value: string }[];
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() excel: EventEmitter<null> = new EventEmitter();
  @Output() addUser: EventEmitter<string> = new EventEmitter();
  public filterForm: FormGroup;

  constructor(private controlContainer: ControlContainer) {}

  public ngOnInit(): void {
    this.filterForm = this.controlContainer.control as FormGroup;
  }
}
