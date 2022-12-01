import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Tab {
  steps: { title: string; subtitle?: string; description?: string }[];
  currentStep: number;
}

@Injectable()
export class ReceivingService {
  /**
   * Tab
   */
  private _tab = new BehaviorSubject<Tab>(null);
  public get tab$(): Observable<Tab> {
    return this._tab.asObservable();
  }
  public initTab(steps): void {
    this._tab.next({
      currentStep: 0,
      steps,
    });
  }
  public changeSteps(index: number): void {
    this._tab.next({
      ...this._tab.value,
      currentStep: index,
    });
  }
}
