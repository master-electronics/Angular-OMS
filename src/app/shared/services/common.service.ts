import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  // title
  private rxjsTitleSubject = new BehaviorSubject<string>('Master Electronics');
  public rxjsTitle: Observable<string> = this.rxjsTitleSubject.asObservable();
  public changeTitle(title: string): void {
    this.rxjsTitleSubject.next(title);
  }

  // Printer Station
  private stationSubject = new BehaviorSubject<string>('');
  public station = this.stationSubject.asObservable();
  public changeStation(station: string): void {
    this.stationSubject.next(station);
  }
  public get stationInfo(): string {
    return this.stationSubject.value;
  }

  constructor(public platform: Platform) {
    //
  }
  isMobile(): boolean {
    return this.platform.IOS || this.platform.ANDROID;
  }
}
