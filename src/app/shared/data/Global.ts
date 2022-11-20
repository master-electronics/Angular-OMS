import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface HttpResponse {
  loading: boolean;
  response?: any;
  error?: {
    message: string;
    type: string;
  };
}

@Injectable()
export class GlobalService {
  /**
   * http response
   */
  private _httpResponse = new BehaviorSubject<HttpResponse>({ loading: false });

  public get httpResponse$(): Observable<HttpResponse> {
    return this._httpResponse.asObservable();
  }
  /**
   * page loading flag
   */
  private _pageLoading = new BehaviorSubject<boolean>(false);

  public get pageLoading$(): Observable<boolean> {
    return this._pageLoading.asObservable();
  }

  public changePageLoading(input: boolean) {
    this._pageLoading.next(input);
  }
}
