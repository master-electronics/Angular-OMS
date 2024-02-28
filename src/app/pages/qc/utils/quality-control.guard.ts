import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
} from '@angular/router';
import { OrderService } from '../data-access/order';

export const QualityControlGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const url = '/qct';
  const _router = inject(Router);
  const order = inject(OrderService);

  let isActive;
  switch (state.url) {
    case `${url}/globalmessages`:
      isActive = order.itnInfo.CustomerNumber;
      break;
    case `${url}/verify`:
      isActive = order.itnInfo;
      break;
    default:
      isActive = true;
      break;
  }
  if (!isActive) {
    _router.navigate([url]);
  }
  return isActive;
};
