import { HttpErrorResponse } from '@angular/common/http';

export interface HttpRequestState<T> {
  isLoading: boolean;
  messageType: 'error' | 'success' | 'info' | 'warning';
  value?: T;
  error?: HttpErrorResponse | Error;
}
