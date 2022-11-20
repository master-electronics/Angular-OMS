import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { CreateItnGQL } from 'src/app/graphql/utilityTools.graphql-gen';
import { environment } from 'src/environments/environment';

export interface Tab {
  steps: { title: string; subtitle?: string; description?: string }[];
  currentStep: number;
}

export interface FormState {
  loading: boolean;
  message?: string;
  messageType?: 'error' | 'success' | 'info' | 'warning';
}

@Injectable()
export class ReceivingService {
  constructor(private _itn: CreateItnGQL) {}

  // Tab
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

  //input form
  private _formState = new BehaviorSubject<FormState>({ loading: false });
  public get formState$(): Observable<FormState> {
    return this._formState.asObservable().pipe(shareReplay(1));
  }
  /**
   * get formState
   */
  public get formState(): FormState {
    return this._formState.value;
  }
  public loadingOn(): void {
    this._formState.next({
      ...this._formState.value,
      loading: true,
    });
  }

  public loadingOff(): void {
    this._formState.next({
      ...this._formState.value,
      loading: false,
    });
  }

  public updateMessage(
    message: string,
    messageType?: 'error' | 'success' | 'info' | 'warning'
  ): void {
    this._formState.next({
      ...this._formState.value,
      message,
      messageType,
    });
  }

  public initFormState(): void {
    this._formState.next({ loading: false });
  }

  /**
   * creatITN
   */
  public creatITN(): Observable<any> {
    return this._itn.fetch({ LocationCode: environment.DistributionCenter });
  }
}
