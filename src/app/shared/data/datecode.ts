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
    // Create a copy of this date object
    const target = new Date(date.valueOf());
    // ISO week date weeks start on monday
    // so correct the day number
    const dayNr = (date.getDay() + 6) % 7;

    // ISO 8601 states that week 1 is the week
    // with the first thursday of that year.
    // Set the target date to the thursday in the target week
    target.setDate(target.getDate() - dayNr + 3);

    // Store the millisecond value of the target date
    const firstThursday = target.valueOf();

    // Set the target to the first thursday of the year
    // First set the target to january first
    target.setMonth(0, 1);
    // Not a thursday? Correct the date to the next thursday
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
    }

    // The weeknumber is the number of weeks between the
    // first thursday of the year and the thursday in the target week
    const weekNumber =
      1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);

    const year = date.getFullYear();
    const twoDigityear = year % 100;
    const datecode = twoDigityear * 100 + weekNumber;
    return datecode;
  }
}
