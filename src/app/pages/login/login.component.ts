import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  ReactiveFormsModule,
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
    ReactiveFormsModule,
    UserPasswordComponent,
  ],
  template: `
    <div
      class="    
      absolute top-0 left-0 z-50 grid h-full w-full grid-cols-1 grid-rows-1 place-items-center bg-gray-700 bg-cover bg-center"
      style="background-image: url(../../../assets/img/bg_1.svg)"
    >
      <div
        class="relative px-5 py-2  w-4/5 rounded-lg bg-gray-200 md:w2/3 lg:w-1/2 xl:w1/3"
      >
        <user-password-form
          (formSubmit)="onSubmit()"
          [formGroup]="loginForm"
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
    private fb: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private userInfo: Find_Or_Create_UserInfoGQL
  ) {}
  public login$;
  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  ngOnInit(): void {
    this.login$ = of(true);
    if (this.authenticationService.userInfo) {
      this.router.navigate(['home']);
    }
  }

  onSubmit(): void {
    this.login$ = this.authenticationService
      .checkUserAuth(
        this.loginForm.value.username.trim().toLowerCase(),
        this.loginForm.value.password
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
