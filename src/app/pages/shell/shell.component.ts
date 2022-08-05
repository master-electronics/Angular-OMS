import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { IdleService } from 'src/app/shared/services/idle.service';
import { environment } from 'src/environments/environment';

import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnInit {
  idle$;
  constructor(
    private auth: AuthenticationService,
    private idleService: IdleService
  ) {}

  ngOnInit(): void {
    this.initialIdleSettings();
  }

  private initialIdleSettings(): void {
    const idleTimeoutInSeconds: number = environment.idleTimeInMinutes * 60;
    this.idle$ = this.idleService.startWatching(idleTimeoutInSeconds).pipe(
      map((isTimeOut: boolean) => {
        if (isTimeOut) {
          this.auth.logout();
          alert('Session timeout. It will redirect to login page.');
        }
      })
    );
  }
}
