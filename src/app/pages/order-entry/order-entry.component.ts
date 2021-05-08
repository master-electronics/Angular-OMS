import { Component, OnInit } from '@angular/core';
import { APIService } from '../../shared/services/API.service';

@Component({
  selector: 'app-order-entry',
  templateUrl: './order-entry.component.html',
})
export class OrderEntryComponent implements OnInit {
  constructor(private apiservice: APIService) {}
  ngOnInit(): void {
    //
  }
}
