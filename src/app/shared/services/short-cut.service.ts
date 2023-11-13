import { Injectable, inject } from '@angular/core';
import { buffer, debounce, fromEvent, share, timer } from 'rxjs';
import { WINDOW } from './window.service';

@Injectable({
  providedIn: 'root',
})
export class ShortCutService {
  keydown$ = fromEvent(inject<Window>(WINDOW), 'keydown').pipe(share());
  src$ = this.keydown$.pipe(
    buffer(this.keydown$.pipe(debounce(() => timer(150))))
  );
}
