import { Injectable, inject } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { UpdateInventoryAfterSortingGQL } from 'src/app/graphql/stocking.graphql-gen';
import { Create_EventLogsGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { StorageUserInfoService } from 'src/app/shared/services/storage-user-info.service';
import { sqlData } from 'src/app/shared/utils/sqlData';

@Injectable()
export class MoveItnService {
  private _move = inject(UpdateInventoryAfterSortingGQL);
  private _userInfo = inject(StorageUserInfoService);
  private _insertLog = inject(Create_EventLogsGQL);
  constructor() {
    //
  }
  public moveItnToPersonal$(itn: string) {
    return this._move
      .mutate({
        User: this._userInfo.userName,
        ITN: itn,
        BinLocation: this._userInfo.userName,
      })
      .pipe(
        switchMap(() => {
          const oldLogs = {
            UserName: this._userInfo.userName,
            UserEventID: sqlData.Event_Stocking_MoveToPersonal,
            InventoryTrackingNumber: itn,
            Message: ``,
          };
          const eventLogs = [
            {
              UserName: this._userInfo.userName,
              EventTypeID: sqlData.Event_Stocking_MoveToPersonal,
              Log: JSON.stringify({
                InventoryTrackingNumber: itn,
              }),
            },
          ];
          return this._insertLog.mutate({
            oldLogs,
            eventLogs,
          });
        })
      );
  }
}
