import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Find_Or_Create_UserInfoGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { CommonModule } from '@angular/common';
import { UserPasswordComponent } from 'src/app/shared/ui/input/user-password-form.component';
import { of } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    UserPasswordComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="    
      absolute top-0 left-0 z-50 grid h-full w-full grid-cols-1 grid-rows-1 place-items-center bg-gray-700 bg-cover bg-center"
      style="background-image: url(../../../assets/img/bg_1.svg)"
    >
      <div
        class="sm:w2/3 md:1/2 relative  w-4/5 rounded-lg bg-gray-200 px-5 py-4 lg:w-1/3 xl:w-1/4"
      >
        <div class="hidden text-center md:block">
          <img
            class="mx-auto"
            src="../../../assets/icon/master_logo.svg"
            alt="logo"
          />
          <h4 class="mt-1 mb-12 pb-1 text-xl font-semibold">
            Master Electronics
          </h4>
        </div>
        <h1 class=" font-semibold text-blue-800">
          Please login to your account
        </h1>
        <user-password-form
          (formSubmit)="onSubmit()"
          [formGroup]="inputForm"
          [data]="login$ | async"
        ></user-password-form>
      </div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private userInfo: Find_Or_Create_UserInfoGQL
  ) {}
  public login$;
  public inputForm: FormGroup;

  ngOnInit(): void {
    this.login$ = of(true);
    if (this.authenticationService.userInfo) {
      this.router.navigate(['home']);
    }
    this.inputForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  onSubmit(): void {
    this.login$ = this.authenticationService
      .login(
        this.inputForm.value.username.trim().toLowerCase(),
        this.inputForm.value.password
      )
      .pipe(
        switchMap(() => {
          const UserInfo = {
            Name: this.authenticationService.userInfo.username,
          };
          return this.userInfo.mutate({ UserInfo: UserInfo });
        }),
        map((res) => {
          const userInfo = JSON.stringify(res.data.findOrCreateUserInfo);
          sessionStorage.setItem('userInfo', userInfo);
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || '/home';
          this.router.navigateByUrl(returnUrl);
        }),
        catchError((error) => {
          return of({
            error: {
              message: error.message,
              name: 'error',
            },
          });
        })
      );
  }
}
