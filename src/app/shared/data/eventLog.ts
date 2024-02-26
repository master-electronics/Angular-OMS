import { Injectable, effect, inject, signal } from '@angular/core';
import { SESSION_STORAGE } from '../utils/storage';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { InsertUserEventLog } from 'src/app/graphql/generated/types.graphql-gen';

export interface EventLog {
  UserName: string;
  EventTypeID: number;
  Log: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventLogService {
  private _sessionStorage = inject(SESSION_STORAGE);
  private _insertLogs = inject(Create_EventLogsGQL);

  constructor() {
    effect(() => {
      this._sessionStorage.setItem(
        'EventLog',
        JSON.stringify(this._eventLog())
      );
    });
  }

  private _eventLog = signal<EventLog>(
    JSON.parse(this._sessionStorage.getItem('EventLog'))
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

  private _oldLogs = signal<InsertUserEventLog>(null);
  public get oldLogs(): InsertUserEventLog {
    return this._oldLogs();
  }
  public initOldLog(log: InsertUserEventLog): void {
    this._oldLogs.set(log);
  }
  public updateOldLog(log: InsertUserEventLog): void {
    this._eventLog.update((node) => ({
      ...node,
      ...log,
    }));
  }

  public insertLogs$() {
    return this._insertLogs.mutate({
      eventLogs: this._eventLog(),
      oldLogs: this._oldLogs(),
    });
  }
}
