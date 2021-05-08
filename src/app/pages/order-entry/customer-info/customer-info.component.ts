import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../shared/services/API.service';

@Component({
  selector: 'customer-info',
  templateUrl: './customer-info.component.html',
})
export class CustomerInfoComponent implements OnInit {
  name = 'master';
  constructor(private apiservice: APIService) {}
  ngOnInit(): void {
    //
  }
}
