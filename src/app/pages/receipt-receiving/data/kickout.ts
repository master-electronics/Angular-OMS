import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, switchMap } from 'rxjs';
import { PrintTextLabelGQL } from 'src/app/graphql/receiptReceiving.graphql-gen';
import { PrinterService } from 'src/app/shared/data/printerInfo';
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
    private _print: PrintTextLabelGQL,
    private _findPrinter: PrinterService
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
  public printTextLabel$(list: string[]): Observable<boolean> {
    return this._findPrinter.printer$.pipe(
      switchMap((printer) => {
        return this._print.fetch({
          PRINTER: printer.Name,
          DPI: String(printer.DPI),
          ORIENTATION: printer.Orientation,
          LINE1: list[0],
          LINE2: list[1],
          LINE3: list[2],
          LINE4: list[3],
        });
      }),
      map(() => true),
      shareReplay(1)
    );
  }
}
