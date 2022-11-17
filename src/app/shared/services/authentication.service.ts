import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, shareReplay, tap } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

interface UserInfo {
  username: string;
  userGroups: string[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // user name
  private _user = new BehaviorSubject<UserInfo>(
    JSON.parse(sessionStorage.getItem('userToken'))
  );
  public get user$(): Observable<UserInfo> {
    return this._user.asObservable();
  }

  public changeUser(user: UserInfo): void {
    this._user.next(user);
  }

  public get userInfo(): UserInfo {
    return this._user.value;
  }

  constructor(private router: Router, private http: HttpClient) {}

  public checkUserAuth(username: string, password: string): Observable<any> {
    return this.http
      .post(`${environment.apiUrl}/AuthJWT/login`, {
        username,
        password,
      })
      .pipe(
        tap((res: { username: string; userGroups: string[] }) => {
          const userToken = JSON.stringify(res);
          sessionStorage.setItem('userToken', userToken);
          this._user.next(res);
        }),
        shareReplay()
      );
  }

  public logout(): void {
    this.router.navigate(['/login']);
    this._user.next(null);
    sessionStorage.clear();
  }
}
