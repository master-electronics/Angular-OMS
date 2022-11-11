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
import { HttpRequestState } from 'src/app/shared/data/interface';
import { AlertBarComponent } from 'src/app/shared/ui/alert-bar.component';

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
            oninput="this.value = this.value.toUpperCase()"
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
            [nzLoading]="state.isLoading"
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

      <alert-bar
        [error]="{ error: state.error, messageType: state.messageType }"
      ></alert-bar>
    </form>
  `,
})
export class SingleInputformComponent implements OnInit {
  public inputForm: FormGroup;
  @Input()
  state: HttpRequestState<any>;
  @Input() validator = { name: '', message: '' };
  @Input() controlName = 'input';
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() title = 'Input';
  @Input() isLoading = false;
  @Output() submit: EventEmitter<null> = new EventEmitter();
  @Output() back: EventEmitter<null> = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  public ngOnInit(): void {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  @ViewChild('input') containerInput!: ElementRef;
  ngAfterViewInit(): void {
    this.containerInput.nativeElement.select();
  }

  public onSubmit(): void {
    this.submit.emit();
  }

  public onBack(): void {
    this.back.emit();
  }
}
