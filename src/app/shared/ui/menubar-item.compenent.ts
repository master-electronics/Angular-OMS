import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  standalone: true,
  imports: [CommonModule, NzMenuModule, NzSpinModule, RouterModule],
  selector: 'menubar-item',
  template: `
    <li
      *ngIf="
        (!menuItem.ADGroupProtected || menuItem.Authorized) &&
        menuItem.Children.length > 0
      "
      nz-submenu
      nzOpen
    >
      <span title>
        <a (click)="closeNavBar()" routerLink="{{ menuItem.Route }}">
          <span>{{ menuItem.Title }}</span>
        </a>
      </span>
      <ul>
        <menubar-item
          *ngFor="let child of menuItem.Children"
          [menuItem]="child"
          (navBarClose)="closeNavBar()"
        ></menubar-item>
      </ul>
    </li>
    <li
      *ngIf="
        (!menuItem.ADGroupProtected || menuItem.Authorized) &&
        menuItem.Children.length < 1
      "
      nz-menu-item
    >
      <a (click)="closeNavBar()" routerLink="{{ menuItem.Route }}">
        {{ menuItem.Title }}
      </a>
    </li>
  `,
})
export class MenubarItemComponent {
  @Output() navBarClose: EventEmitter<null> = new EventEmitter();
  @Input() menuItem;

  closeNavBar(): void {
    this.navBarClose.emit();
  }
}
