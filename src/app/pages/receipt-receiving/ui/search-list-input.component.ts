import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzIconModule],
  selector: 'search-list-input',
  template: `
    <form [formGroup]="inputForm" class="text-lg md:text-xl lg:text-4xl">
      <div class="relative">
        <input
          [formControlName]="controlName"
          type="search"
          [ngClass]="
            inputForm.get(controlName).invalid &&
            inputForm.get(controlName).dirty
              ? 'border-red-500'
              : 'border-blue-500'
          "
          class="focus:shadow-outline h-fit w-full appearance-none rounded border py-2 px-3 text-lg leading-tight text-gray-700 shadow focus:outline-none md:text-xl lg:text-2xl xl:text-4xl"
          [id]="controlName"
          autocomplete="off"
          required
          #input
        />
        <a class=" absolute right-2.5" (click)="clean()">
          <span nz-icon nzType="close-circle" nzTheme="outline"></span>
        </a>
      </div>
      <!-- error message -->
      <div
        *ngIf="
          inputForm.get(controlName).invalid &&
            inputForm.get(controlName).dirty;
          else NonError
        "
        class="italic text-red-500"
      >
        <div *ngIf="inputForm.get(controlName).errors?.['required']">
          This field is required.
        </div>
        <div *ngIf="inputForm.get(controlName).errors?.['notExist']">
          Must select a country!
        </div>
      </div>
      <ng-template #NonError>
        <div class="opacity-0 ">no error</div>
      </ng-template>
      <div
        id="dropdown"
        class="fixed z-10 w-1/3 divide-y divide-gray-100 rounded bg-white shadow dark:bg-gray-700"
      >
        <ul
          class=" text-gray-700 dark:text-gray-200"
          *ngFor="let node of dataSource"
        >
          <li>
            <a
              (click)="onClick(node)"
              class="inline-flex w-full px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              {{ node.name }}
            </a>
          </li>
        </ul>
      </div>
    </form>
  `,
})
export class SearchListInputComponent implements OnInit {
  public inputForm: FormGroup;
  @Input() dataSource;
  @Input() controlName;

  @ViewChild('input') inputFiled!: ElementRef;
  ngAfterViewInit(): void {
    this.inputFiled.nativeElement.focus();
  }
  constructor(private controlContainer: ControlContainer) {}

  ngOnInit() {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  onClick(node) {
    this.inputForm.get(this.controlName).setValue(node.name);
  }

  clean() {
    this.inputForm.get(this.controlName).setValue('');
    this.inputFiled.nativeElement.focus();
  }
}
