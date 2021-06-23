import { BehaviorSubject } from 'rxjs';

export class QualityControlService {
  // Switch Tab
  private activeTabSubject = new BehaviorSubject<number>(1);
  public activeTab = this.activeTabSubject.asObservable();
  public changeTab(tab: number): void {
    this.activeTabSubject.next(tab);
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

  constructor() {
    //
  }
}
