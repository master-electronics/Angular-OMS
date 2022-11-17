import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AlertBarComponent } from 'src/app/shared/ui/alert-bar.component';
import { FormState } from '../data/receivingStore';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule,
    AlertBarComponent,
  ],
  selector: 'single-input-form',
  template: `
    <form nz-form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <nz-form-item>
        <nz-form-label [nzSpan]="7" nzRequired>{{ title }}</nz-form-label>
        <nz-form-control [nzSpan]="12" nzHasFeedback [nzErrorTip]="errorTpl">
          <input
            nz-input
            maxlength="30"
            nzSize="large"
            [type]="type"
            [placeholder]="placeholder"
            [formControlName]="controlName"
            autocomplete="off"
            #input
          />
          <ng-template #errorTpl let-control>
            <ng-container *ngIf="control.hasError(validator.name)">{{
              validator.message
            }}</ng-container>
            <ng-container *ngIf="control.hasError('required')"
              >Please input this field!</ng-container
            >
          </ng-template>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item>
        <nz-form-control [nzOffset]="7" [nzSpan]="16">
          <button
            nz-button
            type="submit"
            nzSize="large"
            nzType="primary"
            [nzLoading]="formState.loading"
            [disabled]="inputForm.invalid"
            class="mr-20 w-32"
          >
            Submit
          </button>
          <button nz-button nzSize="large" type="button" (click)="onBack()">
            Back
          </button>
        </nz-form-control>
      </nz-form-item>
      <div *ngIf="formState.message">
        <alert-bar
          [message]="formState.message"
          [messageType]="formState.messageType"
        ></alert-bar>
      </div>
    </form>
  `,
})
export class SingleInputformComponent implements OnInit {
  public inputForm: FormGroup;
  @Input() formState: FormState = {
    loading: false,
    message: null,
    messageType: null,
  };
  @Input() validator = { name: '', message: '' };
  @Input() controlName = 'input';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() title = 'Input';
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();
  @Output() formBack: EventEmitter<null> = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  @ViewChild('input') inputFiled!: ElementRef;
  ngAfterViewInit(): void {
    this.inputFiled.nativeElement.focus();
  }

  public ngOnInit(): void {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  public onSubmit(): void {
    this.inputFiled.nativeElement.select();
    this.formSubmit.emit();
  }

  public onBack(): void {
    this.formBack.emit();
  }
}
