import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  // Navbar
  private navbar = new BehaviorSubject<string>('Master Electronics');
  public navbar$: Observable<string> = this.navbar.asObservable();
  public changeNavbar(title: string): void {
    this.navbar.next(title);
  }

  // Printer Station
  private _printerStation = new BehaviorSubject<string>('');
  public changePrinterStation(station: string): void {
    this._printerStation.next(station);
  }
  public get printerStation(): string {
    return this._printerStation.value;
  }

  constructor(public platform: Platform) {
    //
  }
  isMobile(): boolean {
    return this.platform.IOS || this.platform.ANDROID;
  }
}
