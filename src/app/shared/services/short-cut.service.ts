import { Injectable } from '@angular/core';
import { buffer, debounce, fromEvent, map, share, tap, timer } from 'rxjs';

@Injectable()
export class ShortCutService {
  private _keydown$ = fromEvent(window, 'keydown').pipe(share());
  shortCut$ = this._keydown$.pipe(
    buffer(this._keydown$.pipe(debounce(() => timer(300)))),
    map((evt) => evt as KeyboardEvent[]),
    map((evt) => evt.map((res) => res.key.toLowerCase()))
  );
}
