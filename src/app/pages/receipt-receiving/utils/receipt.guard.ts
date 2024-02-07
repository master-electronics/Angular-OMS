import { inject } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChildFn,
} from '@angular/router';
import { LabelService } from '../data/label';
import { ReceiptInfoService } from '../data/ReceiptInfo';
import { updateReceiptInfoService } from '../data/updateReceipt';
import { kickoutService } from '../data/kickout';
import { CreateReceiptService } from '../data/createReceipt';

export const ReceiptGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const _router = inject(Router);
  const _receipt = inject(ReceiptInfoService);
  const _info = inject(updateReceiptInfoService);
  const _label = inject(LabelService);
  const _kickout = inject(kickoutService);
  const _create = inject(CreateReceiptService);

  let isActive;
  switch (state.url) {
    case '/receiptreceiving/part/verify':
      isActive = _receipt.partNumber() !== null;
      break;
    case '/receiptreceiving/part/quantity':
      isActive = _receipt.partNumber() !== null;
      break;
    case '/receiptreceiving/part/selectline':
      isActive = _receipt.quantity() !== null;
      break;
    case '/receiptreceiving/overreceiving':
      isActive = _receipt.receiptInfoAfterFilter()?.length !== 0;
      break;
    // case '/receiptreceiving/kickout':
    //   isActive = _receipt.partNumber() !== null;
    // break;
    case '/receiptreceiving/update/country':
      isActive = _receipt.receiptInfoAfterFilter()?.length !== 0;
      break;
    case '/receiptreceiving/update/datecode':
      isActive = _receipt.receiptInfoAfterFilter()?.length !== 0;
      break;
    case '/receiptreceiving/update/ROHS':
      isActive = _receipt.receiptInfoAfterFilter()?.length !== 0;
      break;
    case '/receiptreceiving/label/selectline':
      isActive = _receipt.receiptInfoAfterFilter()?.length !== 0;
      break;
    case '/receiptreceiving/label/assign':
      isActive = _receipt.receiptInfoAfterFilter()?.length !== 0;
      break;
    case '/receiptreceiving/label/printitn':
      isActive = _label.ITNList().length > 0;
      break;
    case '/receiptreceiving/label/sacnlocation':
      isActive = _label.ITNList().length > 0;
      break;
    case '/receiptreceiving/itnlist':
      isActive = _label.ITNList().length > 0;
      break;
    default:
      isActive = true;
      break;
  }
  if (!isActive) {
    _router.navigate(['/receiptreceiving']);
  }
  return isActive;
};
