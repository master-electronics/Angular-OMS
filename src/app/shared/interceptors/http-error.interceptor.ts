import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, concatMap, delay, retryWhen } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

const retryCount = 2;
const retryWaitMilliSeconds = 500;

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retryWhen((error) =>
        error.pipe(
          concatMap((error, count) => {
            if (count < retryCount && [503, 0].includes(error.status)) {
              return of(error);
            }
            return throwError(error);
          }),
          delay(retryWaitMilliSeconds)
        )
      ),
      catchError((err) => {
        if (err.status === 401) {
          // auto logout if 401 response returned from api
          this.cookieService.delete('user');
          this.router.navigate(['/login']);
        }
        if ([0].includes(err.status)) {
          this.router.navigate(['/error'], {
            queryParams: { err: err.status },
          });
        }
        return throwError(err);
      })
    );
  }
}
