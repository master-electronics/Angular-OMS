import { Injectable } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import {
  Insert_UserEventLogsGQL,
  Insert_EventLogsGQL,
} from 'src/app/graphql/utilityTools.graphql-gen';

@Injectable()
export class EventLogService {
  constructor(
    private _userEventLog: Insert_UserEventLogsGQL,
    private _eventLog: Insert_EventLogsGQL
  ) {}

  public insertLog(userEventLog, eventLogs) {
    return combineLatest([
      this._userEventLog.mutate({
        log: userEventLog,
      }),
      this._eventLog.mutate({
        logs: eventLogs,
      }),
    ]).pipe(map(() => true));
  }
}
