import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  getClientErrorMessage(error: Error): { type: string; message: string } {
    const message = error.message ? error.message : error.toString();
    const type = error.name === 'ClientError' ? 'error' : 'warning';
    return { type, message };
  }

  getServerErrorMessage(error: HttpErrorResponse): string {
    return navigator.onLine ? error.message : 'No Internet Connection';
  }
}
