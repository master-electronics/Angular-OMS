import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../..//shared/services/authentication.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {
  date = new Date().getFullYear();
  userInfo: string;
  constructor(private authenticationService: AuthenticationService) {}
  ngOnInit(): void {
    this.authenticationService.rxjsUser.subscribe((userinfo) => (this.userInfo = userinfo));
  }
}
