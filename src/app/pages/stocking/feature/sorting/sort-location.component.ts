import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="container mx-auto px-2 py-2 text-lg md:mt-4">sort location</div>
  `,
})
export class SortLocationComponent {}
