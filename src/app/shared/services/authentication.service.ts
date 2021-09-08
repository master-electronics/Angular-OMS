import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // user name
  private user = new BehaviorSubject<string>(this.cookieService.get('user'));
  public user$: Observable<string> = this.user.asObservable();
  public changeUser(user: string): void {
    this.user.next(user);
  }

  public get userInfo(): string {
    return this.user.value;
  }

  public get userName(): string {
    let username;
    const info = this.user.value;
    if (info) {
      username = JSON.parse(info).username;
    }
    return username;
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}
  userAuth(username: string, password: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/AuthJWT/login`, {
        username,
        password,
      })
      .pipe(
        map((user) => {
          return user;
        })
      );
  }

  logout(): void {
    // remove user from cookie
    this.cookieService.delete('user');
    this.router.navigate(['/login']);
  }
}
