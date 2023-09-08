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
import { ItnListComponent } from '../../stocking/ui/itn-list.component';

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
      _label.reset();
      _info.reset();
      _receipt.resetAfterDone();
      isActive = _receipt.headerID !== null;
      break;
    case '/receiptreceiving/part/verify':
      isActive = _receipt.lineAfterPart !== null;
      break;
    case '/receiptreceiving/part/quantity':
      isActive = _receipt.lineAfterPart !== null;
      break;
      // case '/receiptreceiving/kickout':
      //   isActive = _receipt.lineAfterPart !== null;
      break;
    case '/receiptreceiving/update/country':
      isActive = _receipt.receiptLsAfterQuantity !== null;
      break;
    case '/receiptreceiving/update/datecode':
      isActive = _receipt.receiptLsAfterQuantity !== null;
      break;
    case '/receiptreceiving/update/ROHS':
      isActive = _receipt.receiptLsAfterQuantity !== null;
      break;
    case '/receiptreceiving/label/selectline':
      isActive = _receipt.receiptLsAfterQuantity !== null;
      break;
    case '/receiptreceiving/label/assign':
      isActive = _receipt.selectedReceiptLine !== null;
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
