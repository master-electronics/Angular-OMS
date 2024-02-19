import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // inject service
  http = inject(HttpClient);

  public userAuthentication(username: string, password: string) {
    return this.http.post(`${environment.omsUrl}/auth/login`, {
      username,
      password,
    });
  }
}
