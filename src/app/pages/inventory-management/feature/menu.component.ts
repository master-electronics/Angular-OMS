import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container mx-auto px-2 py-2 text-lg md:mt-4">
      <div class="mt-5 grid justify-center gap-20 text-base">
        <a class="" routerLink="/inventorymanagement/audit/scan-itn">Audit</a>
        <a class="" routerLink="/inventorymanagement/systemtrigger"
          >System Trigger</a
        >
        <a class="" routerLink="/inventorymanagement/usertrigger"
          >User Trigger</a
        >
        <a class="" routerLink="/inventorymanagement/management">Management</a>
      </div>
    </div>
  `,
})
export class MenuComponent {
  ngOnInit(): void {
    sessionStorage.removeItem('currentAudit');
  }
}
