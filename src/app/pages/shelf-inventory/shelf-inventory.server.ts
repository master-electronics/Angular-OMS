import { BehaviorSubject } from 'rxjs';

export class ShelfInventoryService {
  private _ITNList = new BehaviorSubject<string[]>(null);
  public setITNList(itns: string[]): void {
    this._ITNList.next(itns);
  }
  public get ITNList(): string[] {
    return this._ITNList.value;
  }
}
