import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { catchError, map, tap } from 'rxjs/operators';
import { PickService } from '../pick.server';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NgIf, AsyncPipe } from '@angular/common';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FocusInvlidInputDirective } from '../../../shared/directives/focusInvalidInput.directive';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'detail-auth',
  templateUrl: './detail-auth.component.html',
  standalone: true,
  imports: [
    NzGridModule,
    FormsModule,
    FocusInvlidInputDirective,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    NzButtonModule,
    NzWaveModule,
    NgIf,
    NzAlertModule,
    AsyncPipe,
  ],
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
        .checkUserAuth(
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
