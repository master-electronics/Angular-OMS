import { Injectable, effect, inject, signal } from '@angular/core';
import { SESSION_STORAGE } from '../utils/storage';

export interface EventLog {
  UserName: string;
  EventTypeID: number;
  Log: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventLogService {
  sessionStorage = inject(SESSION_STORAGE);
  constructor() {
    effect(() => {
      this.sessionStorage.setItem('EventLog', JSON.stringify(this._eventLog()));
    });
  }

  private _eventLog = signal<EventLog>(
    JSON.parse(this.sessionStorage.getItem('EventLog'))
  );
  public get eventLog(): EventLog {
    return this._eventLog();
  }
  public initEventLog(log: EventLog): void {
    this._eventLog.set(log);
  }
  public updateEventLog(log: EventLog): void {
    this._eventLog.update((ele) => ({
      ...ele,
      ...log,
    }));
  }
}
