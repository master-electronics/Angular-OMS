import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { IdleTimeoutManager } from 'idle-timer-manager';
import { Router } from '@angular/router';
import { ShortcutInput, AllowIn } from 'ng-keyboard-shortcuts';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
})
export class ShellComponent implements AfterViewInit, OnDestroy, OnInit {
  shortcuts: ShortcutInput[] = [];
  timer: IdleTimeoutManager;
  constructor(private router: Router, private auth: AuthenticationService) {}
  @ViewChild('input') input: ElementRef;
  ngAfterViewInit(): void {
    this.shortcuts.push({
      key: 'F4',
      preventDefault: true,
      allowIn: [AllowIn.Textarea, AllowIn.Input],
      command: () => {
        this.router.navigate(['/home']);
      },
    });
  }

  ngOnInit(): void {
    this.timer = new IdleTimeoutManager({
      timeout: 900, //expired after 10 secs
      onExpired: () => {
        this.auth.logout();
        window.location.reload();
      },
    });
  }

  ngOnDestroy(): void {
    this.timer.clear();
  }
}
