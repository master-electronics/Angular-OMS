import { BehaviorSubject } from 'rxjs';
import { CalendarEvent } from 'angular-calendar';
import { WeekView, GetWeekViewArgs, EventColor } from 'calendar-utils';

export interface User {
  id: number;
  name: string;
  color: EventColor;
}

export const users: User[] = [
  {
    id: 0,
    name: 'Priority',
    color: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
  },
  {
    id: 1,
    name: 'Non Priority',
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  },
  {
    id: 2,
    name: '80/20 A Customer',
    color: {
      primary: '#ad2121',
      secondary: '#FAE3E3',
    },
  },
  {
    id: 3,
    name: 'Order Started Pulling',
    color: {
      primary: '#1e90ff',
      secondary: '#D1E8FF',
    },
  },
  {
    id: 4,
    name: 'Aging',
    color: {
      primary: '#e3bc08',
      secondary: '#FDF1BA',
    },
  },
];

export class PickerManageService {
  private _pickerCalendarEvents = new BehaviorSubject<CalendarEvent[]>([]);
  public changepickerCalendarEvents(value: CalendarEvent[]): void {
    this._pickerCalendarEvents.next(value);
  }
  public get pickerCalendarEvents(): CalendarEvent[] {
    return this._pickerCalendarEvents.value;
  }
}
