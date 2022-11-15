import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Tab {
  steps: { title: string; subtitle?: string; description?: string }[];
  currentStep: number;
}

export interface Keyboard {
  layout: string;
  fieldValue: string;
}

export interface FormState {
  loading: boolean;
  message?: string;
  messageType?: 'error' | 'success' | 'info' | 'warning';
}

@Injectable()
export class ReceivingUIStateStore {
  // keyboard
  private _keyboard = new BehaviorSubject<Keyboard>(null);
  public get keyboard$(): Observable<Keyboard> {
    return this._keyboard.asObservable();
  }
  public changeKeyboard(input: Keyboard) {
    this._keyboard.next(input);
  }
  public get keyboard(): Keyboard {
    return this._keyboard.value;
  }

  // Tab
  private readonly steps = [
    { title: 'Receipt', subtitle: '', description: '' },
    { title: 'Part', subtitle: '', description: '' },
    { title: 'Verify', subtitle: '', description: '' },
    { title: 'Purchase Order', subtitle: '', description: '' },
    { title: 'ITN', subtitle: '', description: '' },
  ];
  private _tab = new BehaviorSubject<Tab>({
    currentStep: 0,
    steps: this.steps,
  });
  public get tab$(): Observable<Tab> {
    return this._tab.asObservable();
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
    return this._formState.asObservable();
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
    messageType: 'error' | 'success' | 'info' | 'warning'
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
}
