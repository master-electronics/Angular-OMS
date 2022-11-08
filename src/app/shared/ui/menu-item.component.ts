import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'menu-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div *ngFor="let child of children">
      <div
        class="grid gap-4 text-base"
        *ngIf="!child.ADGroupProtected || child.Authorized"
      >
        <a class="mt-3" routerLink="{{ child.Route }}">
          <span class="mt-3">
            <span>{{ child.Front }}</span>
            <span class="font-bold text-yellow-500">{{ child.Highlight }}</span>
            <span>{{ child.End }}</span>
            <menu-item
              [children]="child.Children"
              *ngIf="child.Children"
            ></menu-item>
          </span>
        </a>
      </div>
    </div>
  `,
})
export class MenuItemComponent {
  @Input() children;
}
