import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  standalone: true,
  selector: 'page-header',
  imports: [CommonModule, NzGridModule],
  template: `
    <div nz-row [nzGutter]="8">
      <div class="text-base sm:text-lg md:mx-16 md:text-2xl lg:text-4xl">
        <div class="gap-2 md:grid">
          <label class="mb-0.5 font-bold text-gray-700">
            {{ headerText }}
          </label>
        </div>
      </div>
    </div>
  `,
})
export class PageHeaderComponent {
  @Input() headerText;
}
