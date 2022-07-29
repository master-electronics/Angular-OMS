import { Injectable } from '@angular/core';
import {
  Observable,
  fromEvent,
  merge,
  Subject,
  timer,
  Subscription,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdleService {
  private idle: Observable<any> = new Observable();
  private timer: Subscription = new Subscription();
  private timeOutMilliSeconds = 1000;
  private idleSubscription: Subscription = new Subscription();

  public expired: Subject<boolean> = new Subject<boolean>();

  public startWatching(timeOutSeconds: number): Observable<any> {
    this.idle = merge(
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'click'),
      fromEvent(document, 'mousedown'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'DOMMouseScroll'),
      fromEvent(document, 'mousewheel'),
      fromEvent(document, 'touchmove'),
      fromEvent(document, 'MSPointerMove'),
      fromEvent(window, 'mousemove'),
      fromEvent(window, 'resize')
    );

    this.timeOutMilliSeconds = timeOutSeconds * 1000;

    this.idleSubscription = this.idle.subscribe(() => {
      this.resetTimer();
    });

    this.startTimer();

    return this.expired;
  }

  private startTimer() {
    this.timer = timer(
      this.timeOutMilliSeconds,
      this.timeOutMilliSeconds
    ).subscribe(() => {
      this.expired.next(true);
    });
  }

  public resetTimer(): void {
    this.timer.unsubscribe();
    this.startTimer();
  }

  public stopTimer(): void {
    this.timer.unsubscribe();
    this.idleSubscription.unsubscribe();
  }
}
