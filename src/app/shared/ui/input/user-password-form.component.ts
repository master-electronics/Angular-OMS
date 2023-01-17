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
import { SubmitButtonComponent } from 'src/app/shared/ui/button/submit-button.component';
import { LoaderButtonComponent } from '../button/loader-button.component';
import { MessageBarComponent } from '../message-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    LoaderButtonComponent,
    MessageBarComponent,
  ],
  selector: 'user-password-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form autocomplete="off" [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <!-- User name -->
      <div>
        <label for="username" class="block font-medium ">Username</label>
        <input
          autocomplete="false"
          formControlName="username"
          type="text"
          name="username"
          id="username"
          [ngClass]="
            this.inputForm.get('username').invalid &&
            this.inputForm.get('username').dirty
              ? 'border-red-500'
              : 'border-blue-500'
          "
          class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg
        border bg-gray-50 p-2.5 text-gray-900"
          #username
        />
      </div>
      <!-- Pasasword -->
      <div>
        <label for="password" class="block font-medium">Password</label>
        <input
          autocomplete="false"
          formControlName="password"
          type="password"
          name="password"
          id="password"
          [ngClass]="
            this.inputForm.get('password').invalid &&
            this.inputForm.get('password').dirty
              ? 'border-red-500'
              : 'border-blue-500'
          "
          class="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border bg-gray-50 p-2.5 text-gray-900 "
        />
      </div>
      <!-- error message -->
      <div *ngIf="data?.error; else space" class="h-16">
        <message-bar
          [message]="data?.error.message"
          [name]="data?.error.name"
        ></message-bar>
      </div>
      <ng-template #space>
        <div class=" h-16"></div>
      </ng-template>
      <!-- Button area -->
      <div class="grid h-10 w-full sm:h-16">
        <submit-button
          [buttonText]="buttonText"
          (buttonClick)="onSubmit()"
          *ngIf="data; else loading"
        >
        </submit-button>
        <ng-template #loading>
          <loader-button></loader-button>
        </ng-template>
      </div>
    </form>
  `,
})
export class UserPasswordComponent implements OnInit {
  public inputForm: FormGroup;
  public vaild;
  @Input() data = { error: null };
  @Input() buttonText = 'Login';
  @Output() formSubmit: EventEmitter<null> = new EventEmitter();
  constructor(private controlContainer: ControlContainer) {}

  public ngOnInit(): void {
    this.inputForm = this.controlContainer.control as FormGroup;
  }

  @ViewChild('username') usernameFiled!: ElementRef;
  ngAfterViewInit(): void {
    this.usernameFiled?.nativeElement.focus();
  }

  public onSubmit(): void {
    if (this.inputForm.valid) {
      this.formSubmit.emit();
    }
    this.usernameFiled.nativeElement.select();
  }
}
