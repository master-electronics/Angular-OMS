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
        <nz-form-item class="col-span-4 ">
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
        <!-- Event selector -->
        <nz-form-item class="col-span-2" *ngIf="userList">
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
        <!-- Event selector -->
        <nz-form-item class="col-span-2">
          <nz-form-control>
            <nz-range-picker
              [nzShowTime]="true"
              formControlName="timeRange"
              (ngModelChange)="this.timeChange.emit($event)"
            ></nz-range-picker>
          </nz-form-control>
        </nz-form-item>

        <nz-form-item nz-col nzSpan="6">
          <button nz-button (click)="reset.emit()" class="mr-4">Clear</button>
          <button nz-button (click)="excel.emit()">Save</button>
        </nz-form-item>
      </div>
    </form>
  `,
})
export class SearchFilterComponent implements OnInit {
  @Input() listOfEvent: { label: string; value: number; groupLabel: string }[];
  @Input() userList: { _id: number; Name: string }[];
  @Output() reset: EventEmitter<null> = new EventEmitter();
  @Output() excel: EventEmitter<null> = new EventEmitter();
  @Output() timeChange: EventEmitter<any> = new EventEmitter();
  @Output() addUser: EventEmitter<string> = new EventEmitter();
  public filterForm: FormGroup;

  constructor(private controlContainer: ControlContainer) {}

  public ngOnInit(): void {
    this.filterForm = this.controlContainer.control as FormGroup;
  }
}
