import { BehaviorSubject } from 'rxjs';

export interface orderInfo {
  ITN: string;
}

export class AggregationOutService {
  // global messages
  private globalMessage = new BehaviorSubject<any>([]);
  public globalMessage$ = this.globalMessage.asObservable();
  public changeGlobalMessages(messages: any): void {
    this.globalMessage.next(messages!);
  }
  public get globalMessages(): string[] {
    return this.globalMessage.value;
  }
}
