import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnDestroy {
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
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.userInfo) {
      this.router.navigate(['home']);
    }
  }

  @ViewChild('usernameError') usernameError: ElementRef;
  @ViewChild('passwordError') passwordError: ElementRef;
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

  verifyUser() {
    this.isLoading = true;
    this.message = '';
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .subscribe({
        next: () => {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
