import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './feature/navbar.component';
@Component({
  template: `
    <div class="flex min-h-screen flex-col">
      <!-- <app-navbar></app-navbar> -->
      <div class="flex-grow">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  standalone: true,
  imports: [NavbarComponent, RouterOutlet],
})
export class ShellComponent {}
