import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="px-2 py-2">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class StockingShell {}
