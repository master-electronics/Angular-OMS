import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface EventLog {
  UserName: string;
  EventTypeID: number;
  Log: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventLogService {
  private _eventLog = new BehaviorSubject<EventLog>(null);
  public get eventLog(): EventLog {
    return this._eventLog.value;
  }
  public initEventLog(log: EventLog): void {
    this._eventLog.next(log);
  }
  public updateEventLog(log: EventLog): void {
    this._eventLog.next({
      ...this._eventLog?.value,
      ...log,
    });
  }
}
