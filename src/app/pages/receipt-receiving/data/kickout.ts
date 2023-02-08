import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class kickoutService {
  private _kickoutItns = new BehaviorSubject<string[]>(null);
  public get kickoutItns(): string[] {
    return this._kickoutItns.value;
  }
  public updatekickoutItns(list: string[]): void {
    this._kickoutItns.next(list);
  }
}
