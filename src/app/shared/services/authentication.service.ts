import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  // inject service
  http = inject(HttpClient);

  public userAuthentication(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/AuthJWT/login`, {
      username,
      password,
    });
  }
}
