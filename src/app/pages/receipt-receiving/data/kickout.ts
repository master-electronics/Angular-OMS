import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { PrintTextLabelGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { CreateItnGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { GlobalService } from 'src/app/shared/data/Global';
import { ReceiptInfoService } from './ReceiptInfo';

interface Kickout {
  receiptLineIDs: number[];
  reason?: string;
  other?: string;
  label?: string;
  location?: string;
}

@Injectable()
export class KickoutService {
  /**
   *
   * @param _receipt part store class
   * @param _print print receiving label end point
   */
  constructor(
    private _receipt: ReceiptInfoService,
    private _http: GlobalService,
    private _print: PrintTextLabelGQL,
    private _itn: CreateItnGQL
  ) {}

  private _kickout = new BehaviorSubject<Kickout>({
    receiptLineIDs: this._receipt.lineAfterPart?.map((res) => res._id),
  });

  /**
   * get kickout value
   */
  public get kickout(): Kickout {
    return this._kickout.getValue();
  }

  /**
   *
   * @param index value of the reason list
   * @param other user input ohter reason
   */
  public updateReasons(input: {
    kickoutReason: string;
    otherReason: string;
  }): void {
    const current = this._kickout.value;
    this._kickout.next({
      ...current,
      reason: input.kickoutReason,
      other: input.otherReason,
    });
  }

  /**
   * updateLocation
   */
  public updateLocation(location: string): void {
    this._kickout.next({
      ...this._kickout.value,
      location,
    });
  }

  /**
   * updateLabel
   */
  public updateLabel(label: string) {
    this._kickout.next({
      ...this._kickout.value,
      label,
    });
  }

  /**
   * printTextLabel
   */
  public printTextLabel$(
    PRINTER: string,
    DPI: string,
    ORIENTATION: string,
    LINE1: string
  ): Observable<boolean> {
    return this._print
      .fetch({
        PRINTER,
        DPI,
        ORIENTATION,
        LINE1,
      })
      .pipe(
        map(() => true),
        shareReplay(1)
      );
  }
}
