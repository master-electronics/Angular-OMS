import { BehaviorSubject } from 'rxjs';

export class AggregationOutService {
  private _containerList = new BehaviorSubject<any>([]);
  public changeContainerList(list: any): void {
    this._containerList.next(list);
  }
  public get containerList(): any {
    return this._containerList.value;
  }

  private _selectedList = new BehaviorSubject<any>([]);
  public changeselectedList(list: any): void {
    this._selectedList.next(list);
  }
  public get selectedList(): any {
    return this._selectedList.value;
  }

  private _totalTotes = new BehaviorSubject<number>(null);
  public changeTotalTotes(count: number): void {
    this._totalTotes.next(count);
  }
  public get totalTotes(): number {
    return this._totalTotes.value;
  }

  private _selectedITNs = new BehaviorSubject<string[]>(null);
  public changeselectedITNs(list: string[]): void {
    this._selectedITNs.next(list);
  }
  public get selectedITNs(): string[] {
    return this._selectedITNs.value;
  }

  private _pickedContainer = new BehaviorSubject<string>(null);
  public changePickedContainer(node: string): void {
    this._pickedContainer.next(node);
  }
  public get pickedContainer(): string {
    return this._pickedContainer.value;
  }

  private _ITNsInOrder = new BehaviorSubject<any[]>(null);
  public changeITNsInOrder(node: any[]): void {
    this._ITNsInOrder.next(node);
  }
  public get ITNsInOrder(): any[] {
    return this._ITNsInOrder.value;
  }
}
