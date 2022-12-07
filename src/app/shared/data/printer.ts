import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import {
  PrintReceivingLabelGQL,
  PrintTextLabelGQL,
} from 'src/app/graphql/receiptReceiving.graphql-gen';
import { FindBindedPrinterGQL } from 'src/app/graphql/utilityTools.graphql-gen';

export interface PrinterInfo {
  Name: string;
  Orientation: string;
  DPI: number;
  StationName: string;
}

@Injectable({
  providedIn: 'root',
})
export class PrinterService {
  constructor(
    private _find: FindBindedPrinterGQL,
    private _itn: PrintReceivingLabelGQL,
    private _text: PrintTextLabelGQL
  ) {
    //
  }
  private _printer = new BehaviorSubject<PrinterInfo>(null);

  public get printer$(): Observable<PrinterInfo> {
    if (this._printer.value) {
      return this._printer.asObservable();
    }
    return of(localStorage.getItem('printerName')).pipe(
      tap((res) => {
        if (!res) {
          throw new Error('Printer is not set!');
        }
      }),
      switchMap((res) => {
        return this._find.fetch({ Name: res });
      }),
      tap((info) => {
        if (!info.data.findPrinters.length) {
          throw new Error("Can't find a printer, Contact the help desk.");
        }
      }),
      map((info) => {
        const printer = info.data.findPrinters[0];
        return {
          Name: printer.Name,
          Orientation: printer.Orientation === 'P' ? 'PORTRAIT' : 'LANDSCAPE',
          DPI: printer.DPI || 300,
          StationName: printer.Orientation,
        };
      }),
      tap((res) => {
        this._printer.next(res);
      })
    );
  }

  public setPrinter$(printerName: string): Observable<PrinterInfo> {
    this._printer.next(null);
    localStorage.removeItem('printerName');
    return this._find.fetch({ Name: printerName }).pipe(
      tap((info) => {
        if (!info.data.findPrinters.length) {
          localStorage.removeItem('printerName');
          throw new Error("Can't find this printer, Contact the help desk!");
        }
      }),
      map((info) => {
        const printer = info.data.findPrinters[0];
        return {
          Name: printer.Name,
          Orientation: printer.Orientation === 'P' ? 'PORTRAIT' : 'LANDSCAPE',
          DPI: printer.DPI || 300,
          StationName: printer.Orientation,
        };
      }),
      tap((printer) => {
        this._printer.next(printer);
        localStorage.setItem('printerName', printer.Name);
      })
    );
  }

  public printITN$(ITN: string) {
    return this.printer$.pipe(
      switchMap((printer) => {
        return this._itn.fetch(
          {
            ITN,
            PRINTER: printer.Name,
            DPI: String(printer.DPI),
            ORIENTATION: printer.Orientation,
          },
          { fetchPolicy: 'network-only' }
        );
      })
    );
  }

  public printText$(list: string[]) {
    return this.printer$.pipe(
      switchMap((printer) => {
        return this._text.fetch(
          {
            PRINTER: printer.Name,
            DPI: String(printer.DPI),
            ORIENTATION: printer.Orientation,
            LINE1: list[0],
            LINE2: list[1],
            LINE3: list[2],
            LINE4: list[3],
          },
          { fetchPolicy: 'network-only' }
        );
      })
    );
  }
}
