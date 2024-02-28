import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, of } from 'rxjs';
import { OrderService } from '../data-access/order';

export const MessagesResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  order: OrderService = inject(OrderService),
  router: Router = inject(Router)
) => {
  return order.fetchGlobalMessages$().pipe(
    catchError((err) => {
      router.navigate(['/qct/verify']);
      return of(err);
    })
  );
};
