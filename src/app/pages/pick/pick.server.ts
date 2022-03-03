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
}
