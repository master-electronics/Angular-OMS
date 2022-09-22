import { BehaviorSubject } from 'rxjs';
import { WeekView, GetWeekViewArgs, EventColor } from 'calendar-utils';

export interface User {
  id: number;
  name: string;
  color: EventColor;
}

export const users: User[] = [
  {
    id: 0,
    name: 'Test 1',
    color: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
  },
  {
    id: 1,
    name: 'Test 2',
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  },
  {
    id: 2,
    name: 'Test 3',
    color: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
  },
  {
    id: 3,
    name: 'Test 3',
    color: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
  },
  {
    id: 4,
    name: 'Test 5',
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  },
  {
    id: 5,
    name: 'Test 6',
    color: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
  },
];

export class PickerManageService {
  private _pickerCalendarEvents = new BehaviorSubject<boolean>(null);
  public changepickerCalendarEvents(value: boolean): void {
    this._pickerCalendarEvents.next(value);
  }
  public get pickerCalendarEvents(): boolean {
    return this._pickerCalendarEvents.value;
  }
}
