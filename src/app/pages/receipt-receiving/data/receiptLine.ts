import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, take } from 'rxjs';

interface KickOut {
  receiptLineID: number;
  reason: number;
  otherReason?: string;
  label?: string;
  location?: string;
}

@Injectable()
export class KickoutStore {
  //
}
