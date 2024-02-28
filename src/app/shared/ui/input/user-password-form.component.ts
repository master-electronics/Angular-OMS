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
import { MessageBarComponent } from '../message-bar.component';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SubmitButtonComponent,
    MessageBarComponent,
  ],
  selector: 'user-password-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <form [formGroup]="inputForm" (ngSubmit)="onSubmit()">
      <!-- User name -->
      <label
        for="username"
        class="input input-bordered flex items-center gap-2 mb-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4 opacity-70"
        >
          <path
            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
          />
        </svg>
        <input
          autocomplete="off"
          formControlName="username"
          type="text"
          name="username"
          id="username"
          class="grow border-transparent focus:border-transparent focus:ring-0 input-sm md:input-md lg:input-lg"
          #username
        />
      </label>
      <!-- Pasasword -->
      <label
        for="password"
        class="input input-bordered flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="w-4 h-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          autocomplete="off"
          formControlName="password"
          type="password"
          name="password"
          id="password"
          class="grow border-transparent focus:border-transparent focus:ring-0 input-sm md:input-md lg:input-lg"
      /></label>
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
          [loading]="!data"
        >
        </submit-button>
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
