import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { StockingService } from '../../data/stocking.service';
import { tap } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';

export const UserItnListResolver: ResolveFn<any> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  stocking: StockingService = inject(StockingService),
  router: Router = inject(Router),
  message: NzMessageService = inject(NzMessageService)
) => {
  return stocking.ItnInUserContainer$().pipe(
    tap((res: any) => {
      if (!res.length) {
        message.info('Empty Personal Container.');
        router.navigate(['../stocking']);
      }
    })
  );
};
