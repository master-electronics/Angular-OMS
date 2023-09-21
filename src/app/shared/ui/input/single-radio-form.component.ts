import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NormalButtonComponent } from '../button/normal-button.component';
import { SubmitButtonComponent } from '../button/submit-button.component';
import { MessageBarComponent } from '../message-bar.component';
import { LoaderButtonComponent } from '../button/loader-button.component';
import { NzRadioModule } from 'ng-zorro-antd/radio';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzSkeletonModule,
    NormalButtonComponent,
    SubmitButtonComponent,
    LoaderButtonComponent,
    MessageBarComponent,
    NzIconModule,
    NzRadioModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'single-radio-form',
  template: `
    <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <div class="text-base sm:text-lg md:mx-16 md:text-2xl lg:text-4xl">
        <div class="gap-2 md:grid" [class.flex]="title.length < 10">
          <label class="mb-0.5 font-bold text-gray-700" [for]="controlName">
            {{ title }}
          </label>
          <div style="height: 10px"></div>
          <div class="relative grow" style="text-align: center;">
            <nz-radio-group
              [(ngModel)]="radioValue"
              [formControlName]="controlName"
              [id]="controlName"
              [ngClass]="[
                inputForm.get(controlName).invalid &&
                inputForm.get(controlName).dirty
                  ? 'border-red-500'
                  : 'border-blue-500'
              ]"
              nzSize="large"
              nzButtonStyle="solid"
            >
              <label
                *ngFor="let option of options"
                nz-radio-button
                nzValue="{{ option.value }}"
                style="margin-left: 35px; margin-right: 35px;"
              >
                {{ option.label }}
              </label>
            </nz-radio-group>
            <!-- error mesage -->
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
              <div *ngIf="inputForm.get(controlName).errors?.['pattern']">
                Invalid Format!
              </div>
              <div *ngFor="let validator of validators">
                <div
                  *ngIf="inputForm.get(controlName).errors?.[validator.name]"
                >
                  {{ validator.message }}
                </div>
              </div>
            </div>
            <ng-template #NonError>
              <div class="opacity-0 ">no error</div>
            </ng-template>
          </div>
        </div>
        <!-- Button area -->
        <div
          class="grid h-12 w-full grid-cols-3 gap-3 sm:h-16 md:mt-6 md:h-24 lg:h-36"
        >
          <submit-button *ngIf="data; else buttonLoading" [disabled]="!isvalid">
          </submit-button>
          <ng-template #buttonLoading>
            <loader-button></loader-button>
          </ng-template>
          <normal-button
            class="col-start-3"
            (buttonClick)="onBack()"
          ></normal-button>
        </div>
        <div *ngIf="data?.error" class="mt-1 md:mt-3 lg:mt-6">
          <message-bar
            [message]="data?.error.message"
            [name]="data?.error.name"
          ></message-bar>
        </div>
      </div>
    </form>
  `,
})
export class SingleRadioFormComponent implements OnInit {
  public inputForm: FormGroup;
  @Input() data = { error: null };
  @Input() validators = [{ name: '', message: '' }];
  @Input() controlName = 'input';
  @Input() title = '';
  @Input() isvalid = true;
  @Input() options = [];
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();
  @Output() formBack: EventEmitter<null> = new EventEmitter();

  constructor(private controlContainer: ControlContainer) {}

  radioValue;

  public ngOnInit(): void {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  public onSubmit(): void {
    this.formSubmit.emit();
  }

  public onBack(): void {
    this.formBack.emit();
  }
}
