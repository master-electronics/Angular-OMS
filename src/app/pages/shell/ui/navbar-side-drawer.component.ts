import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';

@Component({
  standalone: true,
  selector: 'itn-list',
  imports: [CommonModule, NzDrawerModule],
  template: `
    <button
      class="ml-4 inline-flex items-center justify-center rounded-md focus:outline-none"
      (click)="openNavBar()"
    >
      <i
        *ngIf="!showMenu"
        nz-icon
        nzType="menu-fold"
        nzTheme="outline"
        class="text-2xl"
      ></i>
    </button>
    <nz-drawer
      [nzClosable]="false"
      [nzVisible]="showMenu"
      nzPlacement="right"
      nzTitle="Quick Access"
      (nzOnClose)="closeNavBar()"
    >
      <ng-container *nzDrawerContent>
        <ul nz-menu nzMode="inline">
          <li nz-menu-item>
            <a (click)="closeNavBar()" routerLink="/home"> Home </a>
          </li>

          <menubar-item
            *ngFor="let menubarItem of mItems"
            [menuItem]="menubarItem"
            (navBarClose)="closeNavBar()"
          ></menubar-item>
        </ul>
      </ng-container>
    </nz-drawer>
  `,
})
export class NavbarSideDrawerComponent {
  @Input() ItnList;
}
