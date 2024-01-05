import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { Find_Or_Create_UserInfoGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { CommonModule } from '@angular/common';
import { UserPasswordComponent } from 'src/app/shared/ui/input/user-password-form.component';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  StorageUserInfoService,
  UserInfoStorage,
} from 'src/app/shared/services/storage-user-info.service';

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
      style="position: absolute; width: 315px; height: 400px; background-color: blue; z-index: 1000"
    ></div>
    <div
      class="    
      absolute left-0 top-0 z-50 grid h-full w-full grid-cols-1 grid-rows-1 place-items-center bg-gray-700 bg-cover bg-center"
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
          <h4 class="mb-12 mt-1 pb-1 text-xl font-semibold">
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
export class LoginComponent {
  // inject dependence service
  route = inject(ActivatedRoute);
  router = inject(Router);
  authService = inject(AuthenticationService);
  userInfo = inject(Find_Or_Create_UserInfoGQL);
  userStorage = inject(StorageUserInfoService);

  login$: Observable<any> = of(true);
  inputForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  onSubmit(): void {
    let userInfo: UserInfoStorage;
    this.login$ = this.authService
      .userAuthentication(
        this.inputForm.value.username.trim().toLowerCase(),
        this.inputForm.value.password
      )
      .pipe(
        switchMap((res: UserInfoStorage) => {
          userInfo = res;
          this.userStorage.saveUserInfo(userInfo);
          return this.userInfo.mutate({
            UserInfo: { Name: userInfo.userName },
          });
        }),
        map((res) => res.data.findOrCreateUserInfo),
        tap((res) => {
          userInfo = {
            ...userInfo,
            DistributionCenter: res.DistributionCenter
              ? res.DistributionCenter
              : environment.DistributionCenter,
            userId: res._id,
          };
          this.userStorage.saveUserInfo(userInfo);
          const returnUrl = this.route.queryParams['returnUrl'] || '/home';
          this.router.navigateByUrl(returnUrl);
        }),
        catchError((error) => {
          return of({
            error: {
              message: error.error,
              name: 'error',
            },
          });
        })
      );
  }
}
