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
  private printerStation = new BehaviorSubject<string>('');
  public printerStation$ = this.printerStation.asObservable();
  public changeStation(station: string): void {
    this.printerStation.next(station);
  }
  public get printerInfo(): string {
    return this.printerStation.value;
  }

  constructor(public platform: Platform) {
    //
  }
  isMobile(): boolean {
    return this.platform.IOS || this.platform.ANDROID;
  }
}
