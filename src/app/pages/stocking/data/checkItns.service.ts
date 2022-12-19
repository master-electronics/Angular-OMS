import { Injectable } from '@angular/core';
import { BehaviorSubject, elementAt, map, switchMap, tap } from 'rxjs';
import { ITNinfo, StockingService } from './stocking.service';

@Injectable()
export class CheckItnsService {
  constructor(private _stock: StockingService) {}

  private _verifiedItns = new BehaviorSubject<Set<ITNinfo>>(new Set());
  public get verifiedItns() {
    return this._verifiedItns.value;
  }
  public addItnintoVerifiedItns(itn: ITNinfo) {
    this._verifiedItns.value.add(itn);
  }
}
