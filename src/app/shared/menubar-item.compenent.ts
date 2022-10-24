import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
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
export class menubarItem {
  @Output() navBarClose: EventEmitter<any> = new EventEmitter();
  @Input() menuItem;

  closeNavBar(): void {
    this.navBarClose.emit();
  }
}
