import { inject } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { OrderService } from '../data-access/order';

export const MessagesResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  order: OrderService = inject(OrderService),
  router: Router = inject(Router),
  actRoute: ActivatedRoute = inject(ActivatedRoute)
): Observable<any> => {
  return order.fetchGlobalMessages$().pipe(
    catchError((err) => {
      router.navigate(['../verify'], { relativeTo: actRoute });
      return of(err);
    })
  );
};
