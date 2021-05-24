import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {
  isMobile: boolean;
  title = 'Test';
  test;
  constructor() {
    //
  }

  async ngOnInit() {
    //
  }
}
