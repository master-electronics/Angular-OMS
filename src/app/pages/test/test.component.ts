import { Component, OnInit } from '@angular/core';
import { APIService } from '../../API.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {
  isMobile: boolean;
  title = 'Test';
  constructor(private api: APIService) {}

  async ngOnInit() {
    this.api.GetParking('PRK00').then((event) => {
      console.log(event);
    });
  }
}
