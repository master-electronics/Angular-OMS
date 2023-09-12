import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
} from '@angular/router';
import { ItnInfoService } from '../data/itn-info.service';

export const StockingGuard: CanActivateChildFn = (
  _: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const router = inject(Router);
  const _itn = inject(ItnInfoService);

  let isActive: boolean;
  switch (state.url) {
    case '/stocking/location':
      isActive = _itn.itnInfo !== null;
      break;

    default:
      isActive = true;
      break;
  }
  if (!isActive) {
    router.navigate(['/stocking']);
  }
  return isActive;
};
