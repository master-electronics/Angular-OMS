import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { catchError, map } from 'rxjs/operators';
import { of } from 'zen-observable';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy, OnInit {
  isShowPassword = 'password';
  isLoading = false;
  login$;
  message = '';
  elem;
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private commonService: CommonService,
    private titleService: Title
  ) {
    this.elem = document.documentElement;
    if (this.authenticationService.userInfo) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit(): void {
    this.titleService.setTitle('Login');
  }

  @ViewChild('username') username: ElementRef;
  @ViewChild('password') password: ElementRef;
  // convenience getter for easy access to form fields

  toggleShowPassword(): void {
    this.isShowPassword === 'password'
      ? (this.isShowPassword = 'text')
      : (this.isShowPassword = 'password');
  }

  openFullscreen(): void {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  onSubmit(): void {
    this.message = '';
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.login$ = this.authenticationService
        .userAuth(this.f.username.value, this.f.password.value)
        .pipe(
          map((res) => {
            const userToken = JSON.stringify(res);
            sessionStorage.setItem('userToken', userToken);
            this.authenticationService.changeUser(userToken);
            const returnUrl =
              this.route.snapshot.queryParams['returnUrl'] || '/home';
            this.router.navigateByUrl(returnUrl);
            if (this.commonService.isMobile()) {
              this.openFullscreen();
            }
          }),
          catchError((error) => {
            this.message = error.error;
            this.isLoading = false;
            return of();
          })
        );
    }
  }

  verifyUser(): void {
    this.message = '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
