import { Injectable } from '@angular/core';
import { UserContainerService } from 'src/app/shared/data/user-container';

@Injectable()
export class PickingService {
  constructor(private _userC: UserContainerService) {
    //
  }
}
