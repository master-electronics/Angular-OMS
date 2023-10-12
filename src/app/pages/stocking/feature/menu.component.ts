import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container mx-auto px-2 py-2 text-lg md:mt-4">
      <div class="mt-5 grid justify-center gap-20 text-base">
        <a class="" routerLink="/stocking/itn">Sorting</a>
        <a class="" routerLink="/stocking/scantarget">Stocking</a>
        <a class="" routerLink="/stocking/user">Personal ITNs</a>
        <a class="" routerLink="/stocking/movetouser">Move to Personal</a>
      </div>
    </div>
  `,
})
export class MenuComponent {}
