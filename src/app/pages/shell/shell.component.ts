import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
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
