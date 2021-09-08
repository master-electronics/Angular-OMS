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
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy, OnInit {
  isShowPassword = 'password';
  isLoading = false;
  messageType = 'error';
  buttonLabel = 'Sign In';
  buttonStyles = 'bg-indigo-800';
  message = '';
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
    private cookieService: CookieService,
    private commonService: CommonService,
    private titleService: Title
  ) {
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

  onSubmit(): void {
    this.message = '';
    if (this.loginForm.valid) {
      this.subscription.add(this.verifyUser());
    }
  }

  verifyUser(): void {
    this.isLoading = true;
    this.message = '';
    this.authenticationService
      .userAuth(this.f.username.value, this.f.password.value)
      .subscribe({
        next: (user) => {
          const userString = JSON.stringify(user);
          this.cookieService.set('user', userString);
          this.authenticationService.changeUser(userString);
          const returnUrl =
            this.route.snapshot.queryParams['returnUrl'] || '/home';
          this.router.navigateByUrl(returnUrl);
        },
        error: (err) => {
          this.message = err.error;
          this.messageType = 'error';
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
