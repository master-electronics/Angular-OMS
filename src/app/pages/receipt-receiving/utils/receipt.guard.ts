import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateChild,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LabelService } from '../data/label';
import { ReceiptInfoService } from '../data/ReceiptInfo';
import { updateReceiptInfoService } from '../data/updateReceipt';

@Injectable()
export class ReceiptGuard implements CanActivateChild {
  public routeAuthorized: boolean;

  constructor(
    private _router: Router,
    private _receipt: ReceiptInfoService,
    private _info: updateReceiptInfoService,
    private _label: LabelService
  ) {}

  public resetAfterFinished(): void {
    this._label.reset();
    this._info.reset();
    this._receipt.resetAfterDone();
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    let isActive;
    switch (state.url) {
      case '/receiptreceiving/part':
        this.resetAfterFinished();
        isActive = this._receipt.headerID !== null;
        break;
      case '/receiptreceiving/part/verify':
        isActive = this._receipt.lineAfterPart !== null;
        break;
      case '/receiptreceiving/part/quantity':
        isActive = this._receipt.lineAfterPart !== null;
        break;
        // case '/receiptreceiving/kickout':
        //   isActive = this._receipt.lineAfterPart !== null;
        break;
      case '/receiptreceiving/update/country':
        isActive = this._receipt.receiptLsAfterQuantity !== null;
        break;
      case '/receiptreceiving/update/datecode':
        isActive = this._receipt.receiptLsAfterQuantity !== null;
        break;
      case '/receiptreceiving/update/ROHS':
        isActive = this._receipt.receiptLsAfterQuantity !== null;
        break;
      case '/receiptreceiving/label/selectline':
        isActive = this._receipt.receiptLsAfterQuantity !== null;
        break;
      case '/receiptreceiving/label/assign':
        isActive = this._receipt.selectedReceiptLine !== null;
        break;
      case '/receiptreceiving/label/printitn':
        isActive = this._label.quantityList?.length > 0;
        break;
      case '/receiptreceiving/label/sacnlocation':
        isActive = this._label.ITNList !== null;
        break;
      default:
        isActive = true;
        break;
    }
    if (!isActive) {
      this._router.navigate(['/receiptreceiving']);
    }
    return isActive;
  }
}
