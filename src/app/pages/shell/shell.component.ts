import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
})
export class ShellComponent implements OnDestroy, OnInit {
  private subscription = new Subscription();
  constructor(private auth: AuthenticationService) {}

  ngOnInit(): void {
    // this.userIdle.startWatching();
    // this.subscription.add(this.userIdle.onTimerStart().subscribe());
    // this.subscription.add(
    //   this.userIdle.onTimeout().subscribe(() => this.auth.logout())
    // );
  }

  ngOnDestroy(): void {
    // this.userIdle.stopWatching();
    this.subscription.unsubscribe();
  }
}
