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

export const ReceiptGuard: CanActivateChildFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const _router = inject(Router);
  const _receipt = inject(ReceiptInfoService);
  const _info = inject(updateReceiptInfoService);
  const _label = inject(LabelService);

  let isActive;
  switch (state.url) {
    case '/receiptreceiving/part':
      isActive = _receipt.headerID !== null;
      break;
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
      isActive = _label.ITNList.length > 0;
      break;
    case '/receiptreceiving/label/sacnlocation':
      isActive = _label.ITNList !== null;
      break;
    case '/receiptreceiving/label/summary':
      // make sure every itn has binlocation, itn
      if (!_label.ITNList.length) {
        isActive = false;
        break;
      }
      isActive = !_label.ITNList.some((itn) => {
        if (!itn.ContainerID) {
          return true;
        }
        if (!itn.ITN) {
          return true;
        }
        return false;
      });
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
