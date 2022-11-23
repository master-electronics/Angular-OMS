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
  constructor(private _find: FindBindedPrinterGQL) {
    //
  }
  private _printer = new BehaviorSubject<PrinterInfo>(null);

  public get printer$(): Observable<PrinterInfo> {
    if (this._printer.value) {
      return this._printer.asObservable();
    }
    return of(localStorage.getItem('hostname')).pipe(
      tap((res) => {
        if (!res) {
          throw new Error(
            'Hostname is not set. Contact the help desk to have it set.'
          );
        }
      }),
      switchMap((res) => {
        return this._find.fetch({ hostName: res });
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
      shareReplay(1)
    );
  }
}
