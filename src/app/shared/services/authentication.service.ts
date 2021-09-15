import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // user name
  private user = new BehaviorSubject<string>(
    sessionStorage.getItem('userToken')
  );
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

  constructor(private router: Router, private http: HttpClient) {}
  userAuth(username: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/AuthJWT/login`, {
      username,
      password,
    });
  }

  logout(): void {
    // remove user from session
    sessionStorage.setItem('userToken', '');
    this.user.next('');
    this.router.navigate(['/login']);
  }
}
