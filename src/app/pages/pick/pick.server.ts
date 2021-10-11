/* eslint-disable @typescript-eslint/no-explicit-any */
import { BehaviorSubject } from 'rxjs';

export class PickService {
  private _tabStatus = new BehaviorSubject<string[]>([
    'process',
    'wait',
    'wait',
    'wait',
  ]);
  public tabStatus$ = this._tabStatus.asObservable();
  public changeTab(tab: string[]): void {
    this._tabStatus.next(tab);
  }

  // task start time
  private _pickStartTime = new BehaviorSubject<number>(0);
  public resetPickStartTime(date: number): void {
    this._pickStartTime.next(date);
  }
  public get pickStartTime(): number {
    return this._pickStartTime.value;
  }
}
