import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AthTokenInterceptor implements HttpInterceptor {
  constructor() {
    //
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const userToken = sessionStorage.getItem('userToken');
    if (userToken) {
      const authToken = JSON.parse(userToken).idToken;
      const cloned = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + authToken),
      });
      return next.handle(cloned);
    } else {
      return next.handle(request);
    }
  }
}
