import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription, throwError } from 'rxjs';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { catchError, map, tap } from 'rxjs/operators';
import { PickService } from '../pick.server';

@Component({
  selector: 'detail-auth',
  templateUrl: './detail-auth.component.html',
})
export class DetailAuthComponent implements OnDestroy, OnInit {
  title = 'Auth';
  passwordVisible = false;
  isLoading = false;
  login$;
  message = '';

  loginForm = this._fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  private subscription: Subscription = new Subscription();
  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _authenticationService: AuthenticationService,
    private _server: PickService,
    private _titleService: Title
  ) {
    this._titleService.setTitle('Login');
  }

  ngOnInit(): void {
    //
  }

  onSubmit(): void {
    this.message = '';
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.login$ = this._authenticationService
        .userAuth(
          this.f.username.value.trim().toLowerCase(),
          this.f.password.value
        )
        .pipe(
          tap((res) => {
            if (!res.userGroups.some((group) => group === 'whs_supr')) {
              throw 'No WHS Supervisor';
            }
          }),
          map(() => {
            this._server.changeisSupr(true);
            this._router.navigate(['/pulltopick/dropoff']);
          }),
          catchError((error) => {
            this.message = error;
            this.isLoading = false;
            return error;
          })
        );
    }
  }

  back(): void {
    this._router.navigate(['/pulltopick/dropoff']);
  }

  verifyUser(): void {
    this.message = '';
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}