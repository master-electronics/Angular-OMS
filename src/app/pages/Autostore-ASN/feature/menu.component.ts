import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container mx-auto px-2 py-2 text-lg md:mt-4">
      <div class="mt-5 grid justify-center gap-10 text-base">
        <a class="" routerLink="/autostore-asn/start-location"
          >ASN Replenishment</a
        >
        <a class="" routerLink="/autostore-asn/create/scan-location"
          >Send ASN to Autostore</a
        >
        <a class="" routerLink="/autostore-asn/print-label">Print ASN Label</a>
      </div>
    </div>
  `,
})
export class MenuComponent {}
