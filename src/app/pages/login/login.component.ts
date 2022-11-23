import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  UntypedFormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription, throwError } from 'rxjs';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Find_Or_Create_UserInfoGQL } from 'src/app/graphql/utilityTools.graphql-gen';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy, OnInit {
  passwordVisible = false;
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
  showCookieAlert: boolean;
  showCookieModal: boolean;
  hostnameValue;
  hostnameIcon;
  hostnameIconTitle;

  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private authenticationService: AuthenticationService,
    private userInfo: Find_Or_Create_UserInfoGQL,
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
    this.hostnameValue = localStorage.getItem('hostname');

    if (!this.hostnameValue) {
      this.hostnameIcon = 'exclamation-circle';
      this.hostnameIconTitle =
        'Hostname is not set. Contact the help desk to have it set.';
    } else {
      this.hostnameIcon = 'check-circle';
      this.hostnameIconTitle =
        'Hostname is set. Contact the help desk to have it changed.';
      localStorage.setItem('hostname', this.hostnameValue);
    }
  }

  @ViewChild('username') username: ElementRef;
  @ViewChild('password') password: ElementRef;
  // convenience getter for easy access to form fields

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
        .checkUserAuth(
          this.f.username.value.trim().toLowerCase(),
          this.f.password.value
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
            // const returnUrl =
            //   this.route.snapshot.queryParams['returnUrl'] || '/home';
            this.router.navigateByUrl('/home');

            if (this.commonService.isMobile()) {
              this.openFullscreen();
            }
          }),
          catchError((error) => {
            this.message = error.statusText;
            if (typeof error.error === 'string') {
              this.message = error.error;
            }
            this.isLoading = false;
            return throwError(error);
          })
        );
    }
  }

  verifyUser(): void {
    this.message = '';
  }

  hideCookieModal(): void {
    this.showCookieModal = false;
  }

  setHostnameCookie(): void {
    localStorage.setItem('hostname', this.hostnameValue);
    this.hostnameIcon = 'check-circle';
    this.hostnameIconTitle =
      'Hostname is set. Contact the help desk to have it changed.';
    this.showCookieModal = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
