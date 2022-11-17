import { Component } from '@angular/core';
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
})
export class ShellComponent {
  // private initialIdleSettings(): void {
  //   const idleTimeoutInSeconds: number = environment.idleTimeInMinutes * 60;
  //   this.idle$ = this.idleService.startWatching(idleTimeoutInSeconds).pipe(
  //     map((isTimeOut: boolean) => {
  //       if (isTimeOut) {
  //         this.auth.logout();
  //         alert('Session timeout. It will redirect to login page.');
  //       }
  //     })
  //   );
  // }
}
