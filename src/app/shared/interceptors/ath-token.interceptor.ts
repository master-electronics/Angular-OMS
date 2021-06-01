import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AthTokenInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const userInfo = this.cookieService.get('user');
    if (userInfo) {
      const authToken = JSON.parse(userInfo).idToken;
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + authToken),
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}
