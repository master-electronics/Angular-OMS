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
import { FocusInvlidInputDirective } from '../../directives/focusInvalidInput.directive';
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
    FocusInvlidInputDirective,
  ],
  selector: 'user-password-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <!-- User name -->
      <div>
        <label for="username" class="block font-medium ">Username</label>
        <input
          formControlName="username"
          type="text"
          name="username"
          autocomplete="off"
          id="username"
          [ngClass]="
            this.inputForm.get('username').invalid &&
            this.inputForm.get('username').dirty
              ? 'border-red-500'
              : 'border-blue-500'
          "
          class="bg-gray-50 border text-gray-900 rounded-lg focus:ring-primary-600
        focus:border-primary-600 block w-full p-2.5"
          #username
        />
      </div>
      <!-- Pasasword -->
      <div>
        <label for="password" class="block font-medium">Password</label>
        <input
          formControlName="password"
          type="password"
          name="password"
          autocomplete="off"
          id="password"
          [ngClass]="
            this.inputForm.get('password').invalid &&
            this.inputForm.get('password').dirty
              ? 'border-red-500'
              : 'border-blue-500'
          "
          class="bg-gray-50 border text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 "
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
          buttonText="Login"
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
    this.formSubmit.emit();
    this.usernameFiled.nativeElement.select();
  }
}
