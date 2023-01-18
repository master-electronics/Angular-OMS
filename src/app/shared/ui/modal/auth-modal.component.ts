import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { catchError, map, of, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserPasswordComponent } from '../input/user-password-form.component';

@Component({
  selector: 'auth-modal',
  standalone: true,
  imports: [CommonModule, UserPasswordComponent, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      id="auth-modal"
      class="    
      absolute top-0 left-0 z-50 grid h-full w-full grid-cols-1 grid-rows-1 place-items-center bg-gray-400 bg-opacity-30"
    >
      <div class="relative h-full w-4/5 md:h-auto md:w-2/3 lg:w-1/2">
        <div class="relative rounded-lg bg-white shadow ">
          <!-- close button -->
          <button
            type="button"
            class="absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
            (click)="onClose()"
          >
            <svg
              aria-hidden="true"
              class="h-5 w-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
          <!-- auth form -->

          <div class="bg-gray-200 px-5 py-4">
            <div class="hidden text-center md:block">
              <h1 class=" font-semibold text-blue-800">
                {{ message }}
              </h1>
              <user-password-form
                (formSubmit)="onSubmit()"
                [formGroup]="inputForm"
                buttonText="Auth"
                [data]="login$ | async"
              ></user-password-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AuthModalComponent {
  @Input() message = '';
  @Output() clickClose: EventEmitter<null> = new EventEmitter();
  @Output() passAuth: EventEmitter<string> = new EventEmitter();

  constructor(private auth: AuthenticationService) {}
  public login$;
  public inputForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.login$ = of(true);
  }

  onSubmit(): void {
    this.login$ = this.auth
      .checkUserAuth(
        this.inputForm.value.username.trim().toLowerCase(),
        this.inputForm.value.password
      )
      .pipe(
        tap((res) => {
          if (
            !res.userGroups.some(
              (group) => group === 'whs_supr' || group === 'Domain Admins'
            )
          ) {
            throw 'Need WHS Supervisor!';
          }
        }),
        map(() => {
          this.passAuth.emit(this.inputForm.value.username);
          this.clickClose.emit();
        }),
        catchError((error) => {
          return of({
            error: {
              message: error,
              name: 'error',
            },
          });
        })
      );
  }

  onClose() {
    this.clickClose.emit();
  }
}
