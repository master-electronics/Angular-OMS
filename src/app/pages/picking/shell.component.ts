import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="px-2 py-2">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class StockingShell {
  constructor(private commonService: CommonService, private _title: Title) {}

  ngOnInit(): void {
    this.commonService.changeNavbar('Picking');
    this._title.setTitle('Picking');
  }
}
