import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IdleService } from 'src/app/shared/services/idle.service';
import { environment } from 'src/environments/environment';

import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnDestroy, OnInit {
  private subscription = new Subscription();
  constructor(
    private auth: AuthenticationService,
    private idleService: IdleService
  ) {}

  ngOnInit(): void {
    this.initialIdleSettings();
  }

  private initialIdleSettings(): void {
    const idleTimeoutInSeconds: number = environment.idleTimeInMinutes;
    this.idleService
      .startWatching(idleTimeoutInSeconds)
      .subscribe((isTimeOut: boolean) => {
        if (isTimeOut) {
          this.auth.logout();
          alert('Session timeout. It will redirect to login page.');
        }
      });
  }

  ngOnDestroy(): void {
    // this.userIdle.stopWatching();
    this.subscription.unsubscribe();
  }
}
