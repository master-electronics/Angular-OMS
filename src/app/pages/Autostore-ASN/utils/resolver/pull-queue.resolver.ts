import { Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { Resolve } from '@angular/router';
import { PullQueueService } from '../../data/pull-queue.service';

@Injectable()
export class PullQueueResolver {
  constructor(private _pullQueue: PullQueueService) {}
  resolve() {
    return this._pullQueue.pullQueue$.pipe(
      catchError((error) => {
        return of({ error });
      })
    );
  }
}
