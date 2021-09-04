import { Component } from '@angular/core';
import {} from '../../..//shared/services/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  date = new Date().getFullYear();
  userInfo: string;
  constructor() {
    //
  }
}
