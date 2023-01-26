import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatecodeService {
  private _currentDatecode = new BehaviorSubject<number>(null);
  public get currentDatecode(): number {
    if (this._currentDatecode.value) {
      return this._currentDatecode.value;
    }
    const datecode = this.convetDateToWeekNum(new Date());
    this._currentDatecode.next(datecode);
    return datecode;
  }

  convetDateToWeekNum(date: Date): number {
    const year = date.getFullYear();
    const startDate = new Date(year, 0, 1);
    const days = Math.floor(
      (Number(date) - Number(startDate)) / (24 * 60 * 60 * 1000)
    );
    const weekNumber = Math.ceil(days / 7);
    const twoDigityear = year % 100;
    const datecode = twoDigityear * 100 + weekNumber;
    return datecode;
  }
}
