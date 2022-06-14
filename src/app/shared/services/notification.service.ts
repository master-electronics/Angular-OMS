import { Injectable, NgZone } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(public messageBar: NzMessageService, private zone: NgZone) {}

  showMessage(type: string, message: string): void {
    // Had an issue with the snackbar being ran outside of angular's zone.
    this.zone.run(() => {
      this.messageBar.create(type, message);
    });
  }
}
