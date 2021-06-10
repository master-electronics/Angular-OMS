import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService implements OnInit {
  private rxjsUserSubject = new BehaviorSubject<string>(
    this.cookieService.get('user')
  );
  public rxjsUser: Observable<string> = this.rxjsUserSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    //
  }

  public get userInfo(): string {
    return this.rxjsUserSubject.value;
  }

  public get userName(): string {
    let username;
    const info = this.rxjsUserSubject.value;
    if (info) {
      username = JSON.parse(info).username;
    }
    return username;
  }

  public get username(): string {
    return JSON.parse(this.rxjsUserSubject.value).username;
  }

  login(username: string, password: string): Observable<unknown> {
    return this.http
      .post(`${environment.apiUrl}/AuthJWT/login`, {
        username,
        password,
      })
      .pipe(
        map((user: { username: string }) => {
          const userString = JSON.stringify(user);
          this.cookieService.set('user', userString);
          this.rxjsUserSubject.next(userString);
          return user;
        })
      );
  }

  logout(): void {
    // remove user from cookie
    this.cookieService.delete('user');
    this.rxjsUserSubject.next('');
    this.router.navigate(['/login']);
  }
}
