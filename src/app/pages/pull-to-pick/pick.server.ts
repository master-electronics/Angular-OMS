import { BehaviorSubject } from 'rxjs';

export interface PickSettings {
  Zone: number;
  StrictPriority: boolean;
  PriorityCutoff: number;
}

export class PickService {
  private _pickSettings = new BehaviorSubject<PickSettings>(null);
  public changePickSettings(node: PickSettings): void {
    this._pickSettings.next(node);
  }
  public get pickSettings(): PickSettings {
    return this._pickSettings.value;
  }

  private _cartID = new BehaviorSubject<number>(null);
  public changeCartID(id: number): void {
    this._cartID.next(id);
  }
  public get cartID(): number {
    return this._cartID.value;
  }

  private _lastLocation = new BehaviorSubject<string>(null);
  public changeLastLocation(barcode: string): void {
    this._lastLocation.next(barcode);
  }
  public get lastLocation(): string {
    return this._lastLocation.value;
  }

  private _isSupr = new BehaviorSubject<boolean>(null);
  public changeisSupr(value: boolean): void {
    this._isSupr.next(value);
  }
  public get isSupr(): boolean {
    return this._isSupr.value;
  }
}
